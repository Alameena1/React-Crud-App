import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from "../models/user.model.js"; 

// Test route
export const test = (req, res) => {
    res.json({
        message: "API is working",
    });
};

export const updateUser = async (req, res, next) => {
    if (req.body.id !== req.params.id) {
            
        return next(errorHandler(401, "You can update only your account!"));
    }
    try {
        
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
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

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, 'You can delete only your account!'));
    }
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('User has been deleted...');
    } catch (error) {
      next(error);
    }
  
  }

  export const updateProfilePicture = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Construct the profile picture URL
        const profilePictureUrl = `http://localhost:3000/uploads/${file.filename}`;
   

        // Update the user's profile picture in the database
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, // Ensure req.user.id is populated correctly
            { profilePicture: profilePictureUrl },
            { new: true } // Return the updated document
        );

       
        

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the updated user data to the client
        res.status(200).json({
            message: 'Profile picture updated successfully',
            profilePictureUrl: updatedUser.profilePicture,
        });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        next(error);
    }
};
