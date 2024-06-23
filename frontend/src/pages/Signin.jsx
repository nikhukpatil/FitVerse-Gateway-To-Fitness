import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { signin, getUser, resetMessage } from '../Redux/features/auth/authSlice'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import VALIDATIONS from '../constants/ValidationsConstants'
import ERROR from '../constants/ErrorConstants';
import { Helmet } from 'react-helmet'

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();


  const handleSignin = (e) => {

    if (!email || !password) {
      toast.error(ERROR.REQUIRED_DETAILS)
    }

    e.preventDefault();
    if (!VALIDATIONS.EMAIL_REGEX.test(email)) {
      return toast.error(ERROR.EMAIL_ERROR_MESSAGE)
    }

    dispatch(signin({ email, password })).then((response) => {
      if (response.error) {
        toast.error(response.payload)
        dispatch(resetMessage())
      } else {
        toast.success(response.payload.message)
        dispatch(getUser());
        dispatch(resetMessage())
        window.location.href = '/'
      }
    })
  }
  return (
    <>
      <Helmet>
        <title>
          SignIn - Fitverse
        </title>
      </Helmet>
      <form className=' w-full flex justify-center pt-32 sm:pb-32 pb-20 ' onSubmit={handleSignin}>
        <div
          className="relative flex w-96 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md"
        >
          <div
            className="relative mx-4 -mt-6 mb-4 grid h-28 place-items-center overflow-hidden rounded-xl bg-gradient-to-tr from-red-600 to-red-400 bg-clip-border text-white shadow-lg shadow-red-500/40"
          >
            <h3
              className="block font-sans text-3xl font-semibold leading-snug tracking-normal text-white antialiased"
            >
              Sign In
            </h3>
          </div>
          <div className="flex flex-col gap-4 p-6">
            <div className="relative h-11 w-full min-w-[200px]">
              <input
                placeholder=""
                onChange={(e) => {
                  const lowercasedValue = e.target.value.toLowerCase();
                  setEmail(lowercasedValue);
                }}
                required
                type='email'
                maxLength='320'
                className="peer h-full w-full rounded-md border border-red-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-red-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-red-gray-200 placeholder-shown:border-t-red-gray-200 focus:border-2 focus:border-red-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-red-gray-50"
              />
              <label
                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-red-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-red-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-red-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-red-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-red-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-red-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-red-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-red-gray-500"
              >
                Email
              </label>
            </div>
            <div className="relative h-11 w-full min-w-[200px]">
              <input
                placeholder=""
                onChange={(e) => setPassword(e.target.value)}
                required
                type='password'
                maxLength='128'
                className="peer h-full w-full rounded-md border border-red-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-red-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-red-gray-200 placeholder-shown:border-t-red-gray-200 focus:border-2 focus:border-red-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-red-gray-50"
              />
              <label
                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-red-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-red-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-red-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-red-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-red-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-red-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-red-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-red-gray-500"
              >
                Password
              </label>
            </div>
            <Link to="/forgot-password">
              <p className=' text-right text-sm w-full text-red-600'>Forgot Password??</p>
            </Link>
          </div>
          <div className="p-6 pt-0">
            <button
              data-ripple-light="true"
              type="submit"
              className="block w-full select-none rounded-lg bg-gradient-to-tr from-red-600 to-red-400 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Sign In
            </button>
            <p
              className="mt-6 flex justify-center font-sans text-sm font-light leading-normal text-inherit antialiased"
            >
              Don't have an account?

              <Link to='/signup' className="ml-1 block font-sans text-sm font-bold leading-normal text-red-500 antialiased">
                Sign Up
              </Link>

            </p>
          </div>
        </div>

      </form>
    </>
  )
}

export default Signin