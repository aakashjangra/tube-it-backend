import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'

const registerUser = asyncHandler(async (req, res) => {
  const {fullname, username, email, password} = req.body;

  if(
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ){
    throw new ApiError(400, "All fields are required");
  }

  //either a user with matching username or email
  const existedUser = await User.findOne({
    $or: [{username}, {email}]
  })

  if(existedUser){
    throw new ApiError(409, "User with email or username already exists");
  }

  //via multer
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (req.files?.coverImage?.length > 0){
    coverImageLocalPath = req.files?.coverImage[0]?.path;
  }
  if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required");
  }

  console.log('control reached 1')

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  let coverImage;
  if(coverImageLocalPath){
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
  }

  console.log('control reached 2')
  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  console.log('control reached 3')


  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError("Something went wrong while creating the user");
  }

  return res.status(201).json(new ApiResponse(
    200, 
    createdUser, 
    "User registered successfully"
  ));
});

const loginUser = asyncHandler(async (req, res) => {
  res.status(201).json({ message: 'ok' });
});

export { registerUser, loginUser };