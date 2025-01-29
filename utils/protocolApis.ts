import HttpRequest from "./httpRequest";
import PROTOCOL_API_URLS from "../shared/protocolRoutes";
import { IssueRequest } from "../interfaces/bpp_issue";

/**
 * on Issue
 * @param {String} messageId
 */
const onIssue = async (messageId: string) => {
  const apiCall = new HttpRequest(
    process.env.PROTOCOL_BASE_URL,
    PROTOCOL_API_URLS.RESPONSE + "?messageId=" + messageId + "&requestType=" + "on_issue",
    "get"
  );

  const result = await apiCall.send();
  return result.data;
};

/**
 * Protocol Issue
 * @param {Object} data
 * @returns
 */
const protocolIssue = async (data: IssueRequest) => {
  console.log("Enter to call protocol issue Apis")
  const apiCall = new HttpRequest(
    process.env.PROTOCOL_BASE_URL,
    PROTOCOL_API_URLS.ISSUE,
    "POST",
    {
      ...data,
    }
  );

  const result = await apiCall.send();
  return result.data;
};
/**
 * Protocol Issue
 * @param {Object} data
 * @returns
 */
const protocolIssueStatus = async (data: any) => {

  console.log("issueStatus request" , data)
  const apiCall = new HttpRequest(
    process.env.PROTOCOL_BASE_URL,
    PROTOCOL_API_URLS.ISSUE_STATUS,
    "POST",
    {
      ...data,
    }
  );

  const result = await apiCall.send();
  return result.data;
};

/**
 * on order status
 * @param {String} messageId
 */
const onIssueStatus = async (messageId: string) => {
  const apiCall = new HttpRequest(
    process.env.PROTOCOL_BASE_URL,
    PROTOCOL_API_URLS.RESPONSE + "?messageId=" + messageId + "&requestType=" + "on_issue_status",
    "get"
  );

  const result = await apiCall.send();
  return result.data;
};

/**
 * on issue order
 * @param {String} messageId
 */
const onIssueOrder = async (messageId: string) => {
  const apiCall = new HttpRequest(
    process.env.PROTOCOL_BASE_URL,
    PROTOCOL_API_URLS.RESPONSE + "?messageId=" + messageId + "&requestType=" + "on_issue",
    "get"
  );

  const result = await apiCall.send();
  return result.data;
};

/**
 * on issue_status
 * @param {String} messageId
 */
const onIssue_status = async (messageId: any) => {
  const apiCall = new HttpRequest(
    process.env.PROTOCOL_BASE_URL,
    PROTOCOL_API_URLS.RESPONSE + "?messageId=" + messageId + "&requestType=" + "on_issue_status",
    "get"
  );

  const result = await apiCall.send();
  return result.data;
};

export {
  protocolIssue,
  onIssue,
  protocolIssueStatus,
  onIssueStatus,
  onIssueOrder,
  onIssue_status,
};
