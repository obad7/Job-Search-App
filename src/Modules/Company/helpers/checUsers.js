
// Check if the user is authorized to make changes to the company
export const isUserAuthorizedForCompany = (company, userId) => {
    return company.createdBy.toString() === userId.toString()
        || company.HRs.includes(userId);
};
