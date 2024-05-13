import { Request, Response } from "express";
import { signUpService } from "../services/auth.service";
import { User } from "../models";
import bcrypt from "bcryptjs";
import { generateJwtToken } from "../utils/generateJwtToken";
import { validate } from "class-validator";
import { LoginData, SignupData } from "../utils/validators";

/**
 * receive first name, last name, email, password - validate inputs
 * check if a user with that email already exists
 * if does, err
 * else, hash password, create user
 * generate jwt
 * return user and jwt
 */
export const signUp = async (req: Request, res: Response) => {
	try {
		console.log(req.body);
		const signupPostData: SignupData = new SignupData();
		signupPostData.firstName = req.body.firstName;
		signupPostData.lastName = req.body.lastName;
		signupPostData.email = req.body.email;
		signupPostData.password = req.body.password;

		const errors = await validate(signupPostData);
		if (errors.length > 0) {
			return res.status(400).json({
				error: true,
				message: "Invalid input",
				data: errors,
			});
		}

		const user = await User.findOne({ where: { email: signupPostData.email } });
		if (user) {
			return res.status(400).json({
				error: true,
				message: "An account is already registered with this email",
			});
		}

		const salt = await bcrypt.genSalt(10);
		const encryptedPassword = await bcrypt.hash(signupPostData.password, salt);

		const newUser = await User.create({
			firstName: signupPostData.firstName,
			lastName: signupPostData.lastName,
			email: signupPostData.email,
			password: encryptedPassword,
		});

		const jwtToken = generateJwtToken(newUser.id);

		return res.status(201).json({
			error: false,
			message: "Signup successful",
			data: {
				user: {
					id: newUser.id,
					firstName: newUser.firstName,
					lastName: newUser.lastName,
					email: newUser.email,
				},
				token: jwtToken,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			error: true,
			message: "Internal server error",
		});
	}
};

/**
 * receive email and password - validate inputs
 * check if a user with that email exists
 * if doesn't, err
 * else, compare passwords
 * if don't match, err
 * else generate jwt
 * return user and jwt
 */
export const login = async (req: Request, res: Response) => {
	try {
		console.log(req.body);
		const loginPostData: LoginData = new LoginData();
		loginPostData.email = req.body.email;
		loginPostData.password = req.body.password;

		const errors = await validate(loginPostData);
		if (errors.length > 0) {
			return res.status(400).json({
				error: true,
				message: "Invalid input",
				data: errors,
			});
		}

		const user = await User.scope("withPassword").findOne({
			where: { email: loginPostData.email },
		});

		if (!user) {
			return res.status(400).json({
				error: true,
				message: "Incorrect email",
			});
		}

		const passwordVerified = bcrypt.compare(
			loginPostData.password,
			user.password
		);

		if (!passwordVerified) {
			return res.status(400).json({
				error: true,
				message: "Incorrect password",
			});
		}

		const jwtToken = generateJwtToken(user.id);

		return res.status(200).json({
			error: false,
			message: "Login in successful",
			data: {
				user: {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
				},
				token: jwtToken,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			error: true,
			message: "Internal server error",
		});
	}
};

export const getUser = async (req: Request, res: Response) => {
	try {
		const user = await User.findByPk(req.body.id);
		if (user) {
			return res.status(200).json({
				error: false,
				message: "User found successfully",
				data: user,
			});
		} else {
			return res.status(400).json({
				error: true,
				message: "No user found",
			});
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			error: true,
			message: "Internal server error",
		});
	}
};
