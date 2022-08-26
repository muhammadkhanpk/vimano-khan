import { useEffect } from "react";
import AllRoutes from "./routes/AllRoutes";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  userFailure,
  userRequest,
  userSuccess,
} from "./Redux/Actions/userActions";
import FullPageLoading from "./components/Loading/FullPageLoading";
import { get, ref } from "firebase/database";

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.userReducer);
  useEffect(() => {
    dispatch(userRequest());
    auth.onAuthStateChanged((user) => {
      if (user) dispatch(userSuccess(user));
      else dispatch(userFailure(""));
    });
  }, []);
  return loading ? <FullPageLoading /> : <AllRoutes />;
};

export default App;
