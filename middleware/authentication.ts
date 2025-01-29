import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

const authentication = () => async (req: any, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            "status": 401,
            "error": {
                "name": "UNAUTHENTICATED_ERROR",
                "message": "Authentication token is missing"
            }
        })
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({
            "status": 401,
            "error": {
                "name": "UNAUTHENTICATED_ERROR",
                "message": "Authentication token is missing"
            }
        })
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_access_token_secret');

        // Check that decoded is of type JwtPayload
        if (typeof decoded === 'object' && decoded !== null) {
            req.user = { decodedToken: (decoded as JwtPayload).decodedToken, token };
        } else {
            res.status(401).json({
                "status": 401,
                "error": {
                    "name": "UNAUTHENTICATED_ERROR",
                    "message": "Invalid JWT payload"
                }
            })
            return;
        }
        
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                "status": 401,
                "error": {
                    "name": "UNAUTHENTICATED_ERROR",
                    "message": "Authentication token has expired"
                }
            })
            return;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                "status": 401,
                "error": {
                    "name": "UNAUTHENTICATED_ERROR",
                    "message": "Invalid authentication token"
                }
            })
            return;
        }
        if (error instanceof jwt.NotBeforeError) {
            res.status(401).json({
                "status": 401,
                "error": {
                    "name": "UNAUTHENTICATED_ERROR",
                    "message": "Token not yet active"
                }
            })
            return;
        }
        // For any other unexpected errors
        res.status(401).json({
            "status": 401,
            "error": {
                "name": "UNAUTHENTICATED_ERROR",
                "message": "Authentication failed"
            }
        })
        return ;
    }
};

export default authentication;
