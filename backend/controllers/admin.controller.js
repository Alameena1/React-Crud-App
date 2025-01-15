import dotenv from "dotenv";
import user from '../models/user.model.js'; 
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";  
import bcrypt from 'bcryptjs';


dotenv.config();

export const adminSignin = (req, res, next) => {
  const { email, password } = req.body;

  try {
      if (
          email === process.env.ADMIN_EMAIL &&
          password === process.env.ADMIN_PASSWORD
      ) {
          // Generate token with role
          const token = jwt.sign(
              { email, role: "admin" }, // Adding role for role-based access control
              process.env.JWT_SECRET,
              { expiresIn: "1d" }
          );

          res
              .cookie("admin_access_token", token, {
            
                  maxAge: 24 * 60 * 60 * 1000,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "strict",
              })
              .status(200)
              .json({ message: "Sign-in successful",token });
      } else {
          return next(errorHandler(401, "Invalid email or password"));
      }
  } catch (error) {
      next(error);
  }
};

export async function getAllUsers(req, res, next) {
  try {

      const users = await user.find({}, { password: 0 }); // Exclude passwords
      if (!users.length) {
          return next(errorHandler(404, "No users found")); // Handle no user case
      }

      res.status(200).json(users);
  } catch (error) {
      console.error("Error fetching users:", error.message);
      next(errorHandler(500, "Unable to fetch users")); // Error message for client
  }
}

export const deleteUser = async (req, res, next) => {
    try {
       
        
      // Check if the logged-in user is an admin (you can add role checking logic here)
/*       if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You do not have permission to delete users.'));
      } */
  
      // Check if the user exists before attempting deletion
      const newUser = await user.findById(req.params.id);
      if (!newUser) {
        
        return next(errorHandler(404, 'User not found.'));
      }
  
      // Proceed with deleting the user
      await user.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'User has been deleted.' });
    } catch (error) {
      next(error);
    }
  };
  



export const updateUser = async (req, res, next) => {

    try {
     
        
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }

      
        

        const updatedUser = await user.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                },
            },
            { new: true } 
        );

    
      
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};


export const addNewUser = async (req, res, next) => {
    try {
       console.log("ergregtegtey")       
        
        const { name, email, password } = req.body;
 
        // Check if all fields are provided
        if (!name || !email || !password) {
            console.log(name, email, password);
            
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const existingUser = await user.findOne({ email });
        if (existingUser) {
           
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new user({ username: name, email, password: hashedPassword });
        await newUser.save();
   

        res.status(201).json({ message: "User added successfully", user: newUser });
    } catch (error) {
        next(error);
    }
};




export const signout = (req, res) => {
    res.clearCookie('admin_access_token').status(200).json('Signout success!');
  };
