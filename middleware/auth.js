const express       = require('express');
const jwt           = require('jsonwebtoken');
const mongoose      = require('mongoose');

const User = require('../schemas/userModel');

// Function to check a user is logged in and authenticate their login token
function authUser(req, res, next) {
    try {
        let token = req.session.token
        if(token) {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if(err){
                    console.log("[AUTH]: Session expired")

                    const msg = "Login session expired - please login";
                    res.render('login', { msg });
                }
        
                req.user = user;
                next();
            });
        } else {
            console.log("[AUTH] No JWT token found - redirecting to login");
            res.status(401);

            const msg = "Please login to view the requested page";
            res.render('login', { msg });
        }
    } catch (err) {
        console.log("[AUTH] Error retrieving token");

        const msg = "Error validating login token - please contact your administrator";
        res.render('login', { msg });
    }
}

// Function to authorise users and check if they have appropriate permissions to access or perform certain functionality
function authPermission(permission) {
    return async (req, res, next) => {
        const userId = req.session.user._id;

        try {
            const user = await User.findById(userId)
            if(user != null) {
                // Check if the user has the required permission (specified in the function arguments) to perform the specific action or has the 'master' / all permussion
                if (user.permission != permission || user.permission != 'all') {
                    res.status(401);
                    console.log(`[AUTH]: Permission for user with id: ${user._id} denied`);
                    return res.send('Permission Denied. Please contact you administrator for further assistance');       
                }
            }
        } catch (err) {
            console.log(`[ERROR]: ${err}`);
            res.status(500);
            const errMsg = "Sorry - an error occured during authentication. Please contact you administrator for further assistance"    
            return res.render("error", { errMsg });  
        }
        next();
    }
}

// Function to read the currently logged in user's permission from the DB in order to pass to the front end
// The permission data is used to determine what to display to the user
async function checkPermission(userId) {
    try {
        console.log(`[AUTH]: checking permissions for user with ID: ${userId} `);

        const user = await User.findById(userId)
        if(user != null) {
            return user.permission;
        }
    } catch (err) {
        console.log(`[ERROR]: ${err}`);
        res.status(500);
        const errMsg = "Sorry - an error occured - please contact you administrator for further assistance"    
        return res.render("error", { errMsg });  
    }
}

module.exports = {
    authUser,
    checkPermission,
    authPermission
}