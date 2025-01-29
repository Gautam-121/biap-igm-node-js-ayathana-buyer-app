import { Response, NextFunction } from "express";
import IssueService from "./issue.service";
import { validationResult } from "express-validator";
import axios from "axios";
import { ISSUE_TYPES } from "../../utils/issue-reasons";
import BadRequestParameterError from "../../lib/error/bad-request-parameter-error";

const issueService = new IssueService();

class IssueController {
  /**
   * Create issue
   * @param req HTTP request object
   * @param res HTTP response object
   * @param next Callback argument to the middleware function
   */
  async createIssue(req: any, res: Response, _: NextFunction): Promise<void> {
    try {
      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestParameterError(errors.array()[0].msg)
      }
  
      // Destructure request body, params, and user details
      const { body: request, user: userDetails, params } = req;
  
      // Fetch the order details from the API
      const orderResponse = await axios.get(`http://biap-client-node-js:3000/clientApis/v2/orders/${params.orderId}`, {
        headers: {
          Authorization: `Bearer ${userDetails?.token}`, // Extract Bearer token from the incoming request's authorization header
          'Content-Type': 'application/json',
        },
      });
      
      const orderData = orderResponse.data[0];

      // Check if the order exists
      if (!orderData) {
        throw new BadRequestParameterError(`Order not found with orderId: ${params.orderId}`)
      }
  
      // Validate and map items from the request
      const items: any[] = [];
      for (const item of request?.items || []) {
        const matchedItem = orderData?.items?.find((orderItem: any) => orderItem.id === item.id);
        if (!matchedItem) {
          throw new BadRequestParameterError(`Item id: ${item.id} is not part of the order`)
        }
  
        items.push({
          id: item.id,
          quantity: {
            count: item.quantity,
          },
          product: matchedItem?.product,
        });
      }
  
      // Build the request object
      const formattedRequest = {
        context: {
          transaction_id: orderData.transactionId,
          domain: orderData.domain,
          bpp_id: orderData?.bppId,
          bpp_uri: orderData?.bpp_uri,
          city: orderData?.city,
          state: "IND",
        },
        message: {
          issue: {
            bppId: orderData?.bppId,
            bpp_uri: orderData?.bpp_uri,
            category: request?.category,
            sub_category: request?.sub_category,
            created_at: new Date(),
            updated_at: new Date(),
            issue_type: request?.issue_type,
            rating: request?.rating,
            issue_status: request?.status,
            resolution: {},
            resolution_provider: {},
            status: request?.status,
            complainant_info: request?.complainant_action && {
              person: {
                name: orderData?.billing?.name,
              },
              contact: {
                phone: orderData?.billing?.phone,
                email: orderData?.billing?.email,
              },
            },
            description: request?.description && {
              short_desc: request?.description?.short_desc,
              long_desc: request?.description?.long_desc,
              additional_desc: {
                url: "https://buyerapp.com/additonal-details/desc.txt",
                content_type: "text/plain",
              },
              images: request?.description?.images,
            },
            order_details: request?.order_details && {
              id: orderData?.id,
              state: orderData?.state,
              items: items,
              fulfillments: orderData?.fulfillments,
              provider_id: orderData?.provider?.id,
            },
            issue_actions: {
              complainant_actions: [],
              respondent_actions: [],
            },
          },
        },
      };
  
      // Call the issueService to create the issue
      const response = await issueService.createIssue(formattedRequest, userDetails , params.orderId);
      res.status(200).json(response);
    } catch (error: any) {
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
   * Get issues list
   * @param req HTTP request object
   * @param res HTTP response object
   * @param next Callback argument to the middleware function
   */
  getIssuesList(req: any, res: Response, next: NextFunction) {
    const { query = {}, user } = req;

    if(query.limit && query.limit < 0){
      res.status(400).json({
        status: 400,
        error:{
          name: "BAD_REQUEST_PARAMETER_ERROR",
          message: "Limit must be non-negative"
        }
      })
      return;
    }

    if(query.pageNumber && query.pageNumber < 0){
      res.status(400).json({
        status: 400,
        error:{
          name: "BAD_REQUEST_PARAMETER_ERROR",
          message: "pageNumber must be non-negative"
        }
      })
      return
    }

    issueService
      .getIssuesList(user, query)
      .then((response: any) => {
        if (!response.error) {
          res.json({ ...response });
        } else
          res.status(404).json({
            totalCount: 0,
            issues: [],
            error: response.error,
          });
      })
      .catch((err: any) => {
        next(err);
      });
  }

  /**
   * get single issue by transaction id
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   */
  getIssue(req: any, res: Response, next: NextFunction) {
    const { query = {} } = req;

    issueService
      .getSingleIssue(query?.transactionId)
      .then((response: any) => {
        if (!response.error) {
          res.json({ ...response });
        } else
          res.status(400).json({
            totalCount: 0,
            issues: [],
            error: response.error,
          });
      })
      .catch((err: any) => {
        next(err);
      });
  }

  /**
   * on issue
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   */
  onIssue(req: any, res: Response, next: NextFunction) {
    const { query } = req;
    const { messageId } = query;

    issueService
      .onIssueOrder(messageId)
      .then((issue: any) => {
        res.json(issue);
      })
      .catch((err: any) => {
        next(err);
      });
  }

  getIssueReasons(__:any, res:Response , _:NextFunction){
    return res.status(200).json({
      success: true,
      message: "Issue reasons send successfully",
      data: ISSUE_TYPES
    })
  }
}

export default IssueController;
