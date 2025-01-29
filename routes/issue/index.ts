import express from "express";
import { authentication } from "../../middleware";
import IssueController from "../../controller/issue/issue.controller.js";
import IssueValidator from "../../controller/issue/issue.validator"

const router = express.Router();

const issueController = new IssueController();
router.post("/v1/issue/:orderId", authentication(), IssueValidator.createIssue,  issueController.createIssue);
router.get("/v1/issue", authentication(), issueController.getIssue);
router.get("/v1/on_issue", authentication(), issueController.onIssue);
router.get("/v1/getIssues", authentication(), issueController.getIssuesList);
router.get("/v1/get-issue-reasons", authentication(), issueController.getIssueReasons)

export default router;
