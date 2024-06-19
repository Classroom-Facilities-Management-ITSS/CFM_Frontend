import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button, Flex, message } from "antd";

import { activeAccount } from "../../Constant/User";

const Active = () => {
  const nav = useNavigate();

  const [searchParam, setSearchParam] = useSearchParams();
  const token = searchParam.get("token");
  
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Active successfully, please login again!",
    });
  };
  const error = () => {
    messageApi.open({
      type: "error",
      content: "Something went Wrong please try again!",
    });
  };

  const onActive = () => {
    activeAccount(token).then((res) => {
      if (res.status >= 200 && res.status < 300) {
        success();
        nav("/");
      } else {
        error();
      }
    });
  }

  return (
    <Flex align="center" justify="center" style={{ flexDirection: "column" }}>
      <h1 class="mb-20">You have requested to active your account!</h1>
      <Button onClick={onActive}>Active Account</Button>
    </Flex>
  );
};

export default Active;
