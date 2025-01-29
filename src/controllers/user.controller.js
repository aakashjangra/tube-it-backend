import { asyncHandler } from '../utils/asyncHandler.js';
import { upload } from '../middlewares/multer.middleware.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
  const {fullname, username, email, password} = req.body;

  if(
    [fullname, username, email, password].some(() => field?.trim() === "")
  ){
    throw new ApiError(400, "All fields are required");
  }

  //either a user with matching username or email
  const existedUser = User.findOne({
    $or: [{username}, {email}]
  })

  if(existedUser){
    throw new ApiError(409, "User with email or username already exists");
  }

  //via multer
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
  });

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