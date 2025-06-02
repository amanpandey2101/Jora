import { SignUp } from '@clerk/nextjs';
import React from 'react';

const SignInPage = () => {
  return (
    <main className='w-full h-fit flex justify-center items-center pt-10px'>
      <SignUp/>
    </main>
  );
}

export default SignInPage;
