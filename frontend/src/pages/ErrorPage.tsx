// Components
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ marginTop: '10%' }}
    >
      <h1 className="text-3xl mb-5">Oops! This resource isn't available :(</h1>
      <p className="text-xl">Let's go back home</p>
      <Link to={'/'}>
        <Button className="mt-5 rounded-xl">Go back home</Button>
      </Link>
    </div>
  );
};

export default ErrorPage;
