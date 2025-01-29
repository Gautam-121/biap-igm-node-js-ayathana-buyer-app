import { Response, NextFunction, Request } from "express";
import BadRequestParameterError from "../../lib/error/bad-request-parameter-error";
import IssueStatusService from "./issue_status.service";

const issueStatusService = new IssueStatusService();

class IssueStatusController {
  /**
   * issue_status
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   */
  async issueStatus(req: Request, res: Response, _: NextFunction) {
    try {
      const { body: issue } = req;
  
      if (!issue?.message?.issue_id) {
        throw new BadRequestParameterError("Issue_id is required");
      }
  
      const response = await issueStatusService.issue_status(issue);
  
      res.json({ ...response });
    } catch (error:any) {
      console.log("ERROR STACK" , error.stack)
      console.log("ERROR MESSAGE" , error.message)
      if(error instanceof BadRequestParameterError) {
        res.status(400).json({
          status: 400,
          error:{
            name: "BAD_REQUEST_PARAMETER_ERROR",
            message: error.message
          }
        })
        return;
      }
      if (error.response && error.response.status === 404) {
        // Handle errors from the order API
        res.status(404).json({
          status: 404,
          error: {
            name: "NO_RECORD_FOUND",
            message: `Order not found with orderId: ${req.params.orderId}`,
          },
        });
      } else {
        res.status(error?.response?.status || 500).json({
          status: error?.response?.status || 500,
          error: {
            name: error?.response?.name || "INTERNAL_ERROR",
            message: error?.response?.message || "Internal server error",
          },
        });
      }
    }
  }

  /**
   * on issue_status
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function

   */
  onIssue_status(req: Request, res: Response, next: NextFunction) {
    const { query } = req;
    const { messageId }: any = query;

    if (messageId && messageId.length)
      issueStatusService
        .onIssueStatus(messageId)
        .then((response: any) => {
          res.json(response);
        })
        .catch((err: any) => {
          next(err);
        });
    else throw new BadRequestParameterError("message Id is mandatory");
  }
}

export default IssueStatusController;
