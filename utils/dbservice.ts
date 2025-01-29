import BadRequestParameterError from "../lib/error/bad-request-parameter-error";
import IssueModel from "../database/issue.model";

/**
 * @param {String} transactionId
 * @param {Object} issueSchema
 */
const addOrUpdateIssueWithtransactionId = async (
  transactionId: string | any,
  issueSchema: object = {}
) => {
  return await IssueModel.findOneAndUpdate(
    {
      transaction_id: transactionId,
    },
    {
      ...issueSchema,
    },
    { upsert: true }
  );
};

const getIssueByTransactionId = async (transactionId: string) => {
  const issue: any = await IssueModel.find({
    transaction_id: transactionId,
  });

  if (!(issue || issue.length)) {
    throw new BadRequestParameterError("Record not found")
  } else return issue?.[0];
};

export { addOrUpdateIssueWithtransactionId, getIssueByTransactionId };
