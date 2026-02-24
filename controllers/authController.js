const bcrypt = require("bcryptjs")
const User = require("../models/user")
const { body, check, validationResult } = require("express-validator")

exports.getLogin = (req, res, next) => {
res.render("auth/login", { 
  pageTitle: "Login", 
  currentPage: "login",
  isLoggedIn: false,
  errors: [],  
  oldInput: { email: "" },
  user: {},
  });
};

 exports.postLogin = async (req, res, next) => {
  const {email, password} = req.body;
  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["User does not exist"],
      oldInput: {email},
      user: {},
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Invalid Password"],
      oldInput: {email},
      user: {},
    });
  }

  req.session.isLoggedIn = true;
  req.session.user = user;
  res.redirect("/");
 };

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  })
  // res.cookie("isLoggedIn", false); this is cookie code
  // res.clearCookie("isLoggedIn");  this is or option of above

};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle:"SignUp",
    currentPage: "signup",
    isLoggedIn: false,
    errors: [],
    oldInput: {
          fname:"",
          lname: "",
          email: ""
        },
    user: {},
  });
};

exports.postSignup = [
  
  check('fname')
  .trim()
  .isLength({min: 2})
  .withMessage("First name must be at least 2 charactes long")
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage("First name can only contain letters"),

  check('lname')
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage("Last name can only contain letters"),
  
  check('email')
  .isEmail()
  .withMessage('Please enter a valid email'),

  body('email')
 .custom(async (value) => {
        const user = await User.findByEmail(value);
        if (user) {
          throw new Error("Email already registered");
        }
        return true;
      }),
      
  check('password')
  .isLength({min: 8})
  .withMessage("Password must be at least 8 charcater long")
  .matches(/(?=.*[a-z])/)
  .withMessage("Password must be contain at least 1 lowercase character")
  .matches(/(?=.*[A-Z])/)
  .withMessage("Password must be contain at least 1 uppercase character")
  .matches(/(?=.*[0-9])/)
  .withMessage("Password must be contain at least 1 numeric digit")
  .matches(/(?=.*[!@#$%^&*])/)
  .withMessage("Password must be contain at least 1 special character")
  .trim(),

  check('confirmpassword')
  .trim()
  .custom((value, {req}) => {
    if(value !== req.body.password) {
      throw new Error('Passwords do not match')
    }
    return true;
  }),
  
  check('userType')
  .notEmpty()
  .withMessage("Please select a user type")
  .isIn(['guest', 'host'])
  .withMessage("Invalid user type"),

  // check('termsAccepted')
  // .custom((value, {req}) => {
  //   if(value !== "on") {
  //     throw new Error("Please accpet the TERMS and CONDITIONS before registeration")
  //   }
  // }),
  
  (req, res, next) => {
    const {fname, lname, email, password, userType} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      return res.status(422).render("auth/signup", {
        pageTitle: "SignUp",
        isLoggedIn: false,
        errors: errors.array().map(error => error.msg),
        oldInput: {
          fname,
          lname,
          email
        },
        user: {},
      })
    }

    bcrypt.hash(password, 12).then(hashedPassword => {
      const user = new User({
        fname,
        lname, 
        email, 
        password: hashedPassword, 
        userType
      });
      user.userSave().then(() => {
        console.log("User Info Saved in Database");
      }).catch(error => {
        console.log("Error while saving user: ", error)
        return res.status(422).render("auth/signup", {
          pageTitle: "SignUp",
          isLoggedIn: false,
          errors: [error.message],
          oldInput: {
            fname,
            lname,
            email
          },
          user: {},
        })
      });
    });
    req.session.isLoggedIn = true;
    res.redirect("/");2
}
]