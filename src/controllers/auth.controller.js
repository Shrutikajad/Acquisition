import {formatValidationError} from '../utlis/format.js'
import { logger } from "../config/logger.js"
import {signupSchema} from '../validations/auth.validation.js'
import {createdUser} from '../services/auth.service.js'



export const signup =async(req,res,next)=>{
    try {

        const validationResult=signupSchema.safeParse(req.body)

        if(!validationResult.success){
            return res.status(400).json({
                error: 'Validation failed',
                details:formatValidationError(validationResult.error)
            })
        }

        const {name,email,role}=validationResult.data

        const user=await createdUser({name,email,password,role})

        const token =jwttoken.sign({id:user.id, email:user.email,role:user.role })


        logger.info(`User registered SUccessFully: ${email}`)
        res.status(201).json({
            message:'User registered',
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })

        
    } catch (error) {
        logger.error('Signup error',e)

        if(e.message === 'User with this email already exists'){
            return res.status(400).json({error:'Email already exists'})
        }

        next(e)
    }
}


export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }


    const token = jwttoken.sign(
      { id: user.id, email: user.email, role: user.role },
    );

    logger.info(`User logged in: ${email}`);
    res.status(200).json({
       message: "Signin successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (error) {
    logger.error("Signin error", error);
    next(error);
  }
};

// ---------------- SIGNOUT ----------------
