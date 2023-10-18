exports.getLeanEmails = (votesArr) => {
    const emails = [];

    votesArr.forEach(object => emails.push(object.userId.email));
    
    return emails.join(", ");
};
