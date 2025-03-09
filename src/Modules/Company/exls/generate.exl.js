import xl from "excel4node";
import cloudinary from "../../../utils/file uploading/cloudinaryConfig.js";
import ApplicationModel from "../../../DB/Models/application.model.js";
import JobModel from "../../../DB/Models/job.model.js";
import UserModel from "../../../DB/Models/user.model.js";
import fs from "fs";
import path from "path";

/**
  *  This is an Express.js route handler that exports company applications to an Excel file. Here's a succinct breakdown:
  *  It takes a companyId from the request parameters and an optional date from the query parameters (defaulting to today's date if not provided).
  *  It fetches all jobs belonging to the company and creates a map of job IDs to job titles.
  *  It fetches all applications for these jobs, created on the specified date, and populates the user's first name.
  *  If no applications are found, it returns a 404 error.
  *  It generates an Excel file with the application data, including user first name, job title, status, created at, and CV link.
  *  It saves the Excel file to a temporary directory and uploads it to Cloudinary.
  *  If the upload is successful, it returns a JSON response with the URL of the uploaded file. If any errors occur during the process, it returns an error response.
  *  In summary, this code exports company applications to an Excel file and uploads it to Cloudinary, providing a URL to access the file.
 */

export const exportCompanyApplications = async (req, res, next) => {

    const { companyId } = req.params;
    let { date } = req.query;

    if (!date) {
        date = new Date().toISOString().split("T")[0]; // Defaults to today
    }

    // Convert date string to Date object in UTC
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    // Get all jobs that belong to this company
    const jobs = await JobModel.find({ companyId }).select("_id jobTitle").lean();
    if (!jobs.length) {
        return next(new Error("No jobs found for this company", { cause: 404 }));
    }

    const jobMap = jobs.reduce((acc, job) => {
        acc[job._id] = job.jobTitle; // Map jobId to jobTitle
        return acc;
    }, {});

    const jobIds = jobs.map(job => job._id);

    // Fetch applications for these jobs
    const applications = await ApplicationModel.find({
        jobId: { $in: jobIds },
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        deletedAt: null
    })
        .populate("userId", "firstName") // Populate user firstName
        .lean();

    console.log("Filtered Applications:", applications);

    if (!applications.length) {
        return next(new Error("No applications found for this date", { cause: 404 }));
    }

    // temp folder exists
    const tempDir = path.resolve("./temp");
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    // **Step 4:** Generate Excel file
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet("Applications");

    // Add headers
    const headers = ["User First Name", "Job Title", "Status", "Created At", "CV Link"];
    headers.forEach((header, i) => ws.cell(1, i + 1).string(header));

    // Add data rows
    applications.forEach((app, rowIndex) => {
        ws.cell(rowIndex + 2, 1).string(app.userId?.firstName || "Unknown User");
        ws.cell(rowIndex + 2, 2).string(jobMap[app.jobId] || "Unknown Job");
        ws.cell(rowIndex + 2, 3).string(app.status);
        ws.cell(rowIndex + 2, 4).string(new Date(app.createdAt).toISOString());
        ws.cell(rowIndex + 2, 5).string(app.userCV?.secure_url || "No CV");
    });

    // Save the file
    const filePath = path.join(tempDir, `Company_${companyId}_Applications.xlsx`);
    wb.write(filePath, async (err) => {
        if (err) {
            console.error("Excel Write Error:", err);
            return next(new Error("Error generating Excel file"));
        }

        try {
            // Upload to Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(filePath, {
                resource_type: "raw",
                folder: `Companies/${companyId}/exports`
            });

            // Delete local file after successful upload
            fs.unlinkSync(filePath);

            res.status(200).json({ success: true, url: uploadResponse.secure_url });
        } catch (uploadError) {
            console.error("Cloudinary Upload Error:", uploadError);
            return next(new Error("Error uploading to Cloudinary"));
        }
    });

};
