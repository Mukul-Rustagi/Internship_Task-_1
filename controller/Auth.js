const bcrypt = require("bcrypt");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// signup route handler
exports.signup = async (req, res) => {
    try {
        // get data
        const { name, email, password, role } = req.body;
        // check if user already exist
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exist',
            });
        }

        //  secure password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (err) {
            return res.status(500)
                .json({
                    success: false,
                    message: 'error in haashing password',
                });
        }

        // create entry for user
        const user = await User.create({
            name, email, password: hashedPassword, role
        })

        return res.status(200).json({
            success: true,
            message: 'User created successfully',
        });
    }


    catch (err) {
        console.log(err);
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'User cannot be registered, please try again later'
        });
    }
}

// login
exports.login = async (req, res) => {
    try {
        // data fetch
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details carefuly"
            });
        }

        let user = await User.findOne({ email });

        // if not a registered user
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'user is not registered',
            });
        }

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        }

        // verify password &generate JWT token
        if (await bcrypt.compare(password, user.password)) {

            // password match
            let token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {

                expiresIn: "2h",
            });
            // console.log(user);
            user=user.toObject();
            user.token = token;
            user.password = undefined;
            // console.log(user);
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'User logges successfully',
            });

        }

        else {
            // password do not match
            return res.status(500).json({
                success: false,
                message: "Password Incorect",
            });
        }

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            
            success: false,
            message: 'Login failure'
        });
    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        // Here you would normally send a password reset email
        res.json({ message: 'Password reset link sent to email' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({
         success:"true",
         message: 'Server error', error });
    }
  };