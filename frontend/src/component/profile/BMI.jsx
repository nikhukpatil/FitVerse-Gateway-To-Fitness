import React from 'react'
import { toast } from 'react-hot-toast'
import { TiDeleteOutline } from "react-icons/ti";
import { useDispatch, useSelector } from 'react-redux'
import { deleteBMI, resetMessage } from '../../Redux/features/auth/authSlice'
import { Helmet } from 'react-helmet'


const BMI = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth)
  const BMIData = user?.BMIs;



  const handleDeleteBMI = (BMIId) => {
    dispatch(deleteBMI(BMIId)).then((response) => {
      if (response.error) {
        toast.error(response.payload);
        dispatch(resetMessage());
      } else {
        toast.success(response.payload.message);
      }
    })
  }


  return (
    <>
      <Helmet>
        <title>
          Your BMI - Fitverse
        </title>
      </Helmet>
      <h1 className=' px-5'>Only latest 5 BMI are saved</h1>
      {BMIData && BMIData.length === 0 ? (
        <>
          <p className='flex w-full justify-center py-4'>You do not have any saved BMI's</p>
        </>
      ) : (
        <div className="flex flex-row sm:overflow-y-hidden sm:flex-wrap overflow-y-auto">
          {BMIData &&
            BMIData.map((BMI) => {
              const date = new Date(BMI?.date);
              const day = date.getDate().toString().padStart(2, '0');
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const year = date.getFullYear().toString().slice(-2);
              const formattedDate = `${day}-${month}-${year}`;

              return (
                <div key={BMI?._id} className="p-5 relative">
                  <div className="flex flex-col bg-[#303030] rounded-3xl w-[250px] text-white relative">
                    <button
                      onClick={() => handleDeleteBMI(BMI?._id)}
                      className="absolute top-4 right-4 text-white rounded-full"
                      title="Delete"
                    >
                      <TiDeleteOutline className=' w-6 h-6 text-red-500 ' />
                    </button>
                    <div className="px-6 py-8 sm:p-10 sm:pb-6 p-4 flex-grow">
                      <div className="grid items-center justify-center w-full text-center">
                        <div>
                          <h2 className="text-lg font-medium tracking-tighterlg:text-3xl">
                            Date: {formattedDate}
                          </h2>
                          <p className="mt-2 text-sm">Height: {BMI?.height} cm</p>
                          <p className="mt-2 text-sm">Weight: {BMI?.weight} kg</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid items-center justify-center w-full text-center pb-6">
                      <div className="text-lg font-medium">
                        <h3>BMI: {BMI?.BMI}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* <Button className='h-10 w-20 m-10 bg-black text-white' onClick={handleSignOut}>Sign Out</Button> */}
    </>
  )
}

export default BMI