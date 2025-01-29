import { onIssue_status } from "../../utils/protocolApis";
import Issue from "../../database/issue.model";
import { PROTOCOL_CONTEXT } from "../../shared/constants";
import ContextFactory from "../../utils/contextFactory";
import BppIssueStatusService from "./bpp.issue_status.service";
import {
  addOrUpdateIssueWithtransactionId,
  getIssueByTransactionId,
} from "../../utils/dbservice";
import { IssueProps, RespondentActions } from "../../interfaces/issue";
import BugzillaService from "../../controller/bugzilla/bugzilla.service";
import BadRequestParameterError from "../../lib/error/bad-request-parameter-error";

const bppIssueStatusService = new BppIssueStatusService();
const bugzillaService = new BugzillaService();
class IssueStatusService {
  async getIssueByIssueId(issueId: string) {
    const issue: any = await Issue.find({
      issueId: issueId,
    });

    if (!issue || issue.length == 0)
      throw new BadRequestParameterError("Record not found")
    else return issue;
  }

  /**
   * status issue
   * @param {Object} order
   */
  async issue_status(order: any) {
    try {
      const { message } = order;

      const issueDetails = await this.getIssueByIssueId(message?.issue_id);

      if(issueDetails[0]?.issue_status === "Close"){
        throw new BadRequestParameterError("Issue is already close")
      }

      console.log("issueDetails" , issueDetails)

      const contextFactory = new ContextFactory();
      const context = contextFactory.create({
        action: PROTOCOL_CONTEXT.ISSUE_STATUS,
        transactionId: issueDetails[0]?.transaction_id,
        bppId: issueDetails[0]?.bppId,
        bpp_uri: issueDetails?.[0]?.bpp_uri,
        cityCode: issueDetails.city,
      });

      return await bppIssueStatusService.getIssueStatus(context, message);
    } catch (err) {
      throw err;
    }
  }

  /**
   * on support order
   * @param {Object} messageId
   */
  async onIssueStatus(messageId: Object) {
    try {
      const protocolSupportResponse = await onIssue_status(messageId);
      if (protocolSupportResponse && protocolSupportResponse.length) {
        const respondent_actions =
          protocolSupportResponse?.[0]?.message?.issue?.issue_actions
            ?.respondent_actions;

        const issue: IssueProps = await getIssueByTransactionId(
          protocolSupportResponse?.[0]?.context?.transaction_id
        );
        respondent_actions?.map((item: RespondentActions) => {
          if (item?.respondent_action === "RESOLVED") {
            bugzillaService.updateIssueInBugzilla(
              protocolSupportResponse?.[0]?.context?.transaction_id,
              issue?.issue_actions,
              true
            );
          }
        });

        issue?.issue_actions?.respondent_actions?.splice(
          0,
          issue?.issue_actions?.respondent_actions.length,
          ...respondent_actions
        );

        issue["resolution_provider"] =
          protocolSupportResponse?.[0]?.message?.issue?.resolution_provider;
        issue["resolution"] =
          protocolSupportResponse?.[0]?.message?.issue?.resolution;

        await addOrUpdateIssueWithtransactionId(
          protocolSupportResponse?.[0]?.context?.transaction_id,
          issue
        );

        if (process.env.BUGZILLA_API_KEY || process.env.SELECTED_ISSUE_CRM) {
          bugzillaService.updateIssueInBugzilla(
            protocolSupportResponse?.[0]?.context?.transaction_id,
            issue.issue_actions
          );
        }
        console.log(protocolSupportResponse)
        protocolSupportResponse[0].message.issue.updated_at = protocolSupportResponse?.[0].context.timestamp;
        return protocolSupportResponse?.[0];
      } else {
        const contextFactory = new ContextFactory();
        const context = contextFactory.create({
          messageId: messageId,
          action: PROTOCOL_CONTEXT.ON_ISSUE_STATUS,
        });

        return {
          context,
          error: {
            message: "No data found",
          },
        };
      }
    } catch (err) {
      throw err;
    }
  }
}

export default IssueStatusService;
