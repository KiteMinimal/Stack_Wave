
const userModel = require("../models/user.model");

const signUpController = async function(req,res){
    try{
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const userAlreadyExist = await userModel.findOne({email})

        if(userAlreadyExist){
            return res.status(409).json({
                message: "User already exist"
            })
        }

        const hashedPassword = await userModel.hashPassword(password);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword
        })

        const token = user.generateToken();

        delete user._doc.password

        res.status(201).json({
            user,
            token,
            message: "user created successfully"
        })

    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}

const loginController = async function(req,res){
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const user = await userModel.findOne({email}).select("+password")

        if(!user){
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const isMatched = await user.comparePassword(password);
        if(!isMatched){
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const token = user.generateToken();

        delete user._doc.password

        res.status(200).json({
            user,
            token,
            message: "User logged In successfully"
        })

    } 
    catch(err){
        res.status(500).json({ message: err.message });
    }
}

const profileController = async function(req,res){
    try{
        const { _id } = req?.user;
        console.log(req.user);
        

        if(!_id){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const user = await userModel.findById(_id);

        res.status(200).json({
            user
        })

    }
    catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}

module.exports = {
    signUpController,
    loginController,
    profileController
}