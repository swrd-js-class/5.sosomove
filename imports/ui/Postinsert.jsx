import React from "react";
import { useParams } from "react-router-dom";

export default () => {
  const params = useParams();
  // params._id
  return <div>This is postinsert page: {params._id}</div>;
};