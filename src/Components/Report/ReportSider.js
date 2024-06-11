import React from "react";

import { Avatar, Flex, List } from "antd";

import reportsData from "../../Constant/initialData/report.json";

const ReportSider = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user.account.role != "admin") {
    reportsData = reportsData.filter(
      (report) => report.userID == user.accountID
    );
  }

  return (
    <>
      <Flex
        style={{ margin: "10px 0px", fontSize: 20, fontWeight: "bold" }}
        justify="center"
      >
        Class's report
      </Flex>
      <List
        dataSource={reportsData}
        itemLayout="horizontal"
        renderItem={(item, index) => (
          <List.Item style={{ margin: 15 }}>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                />
              }
              title={<a href="https://ant.design">{item.note}</a>}
              description="Some random comment"
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default ReportSider;
