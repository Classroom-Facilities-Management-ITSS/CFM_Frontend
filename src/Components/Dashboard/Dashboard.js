import "./Dashboard.css";

import React from "react";

import { Flex, Space, Card } from "antd";
import { AuditOutlined, UserOutlined, ApiOutlined } from "@ant-design/icons";

import { PieChart } from "@mui/x-charts/PieChart";

import usersData from "../../Constant/initialData/user.json";
import reportData from "../../Constant/initialData/report.json";
import devicesData from "../../Constant/initialData/device.json";

const user = JSON.parse(localStorage.getItem("user"));
const brokenDevices = devicesData.filter((device) => device.status != "normal");

const Dashboard = () => {
  if (user.account.role == "user") {
    reportData = reportData.filter((report) => report.userID == user.accountID);
  }

  return (
    <div class="p-5">
      <Flex id="dash-header" align="center" justify="center">
        <div class="text-2xl font-bold">LABLH</div>
        <div>Empower your teaching journey and solve real-world problems</div>
      </Flex>

      <Flex align="center" justify="center" style={{ marginTop: 25 }}>
        <Space id="dash-card" size={36} direction="horizontal">
          <Card
            title="Report"
            extra={<AuditOutlined id="card-icon" />}
            style={{
              width: 300,
            }}
          >
            <p>{reportData.length} report(s) need to check</p>
          </Card>

          <Card
            title="Users"
            extra={<UserOutlined id="card-icon" />}
            style={{
              width: 300,
            }}
          >
            <p>{usersData.length} user(s) available </p>
          </Card>

          <Card
            title="Broken Devices"
            extra={<ApiOutlined id="card-icon" />}
            style={{
              width: 300,
            }}
          >
            <p>{brokenDevices.length} device(s) need to check and repair </p>
          </Card>
        </Space>
      </Flex>

      <Flex align="center" justify="center" style={{ marginTop: 50 }}>
        <Space direction="horizontal" size={48}>
          <Space id="chart-container" size={36} direction="vertical" style={{ alignItems: "center" }}>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: brokenDevices.length, label: "Broken" },
                    {
                      id: 1,
                      value: devicesData.length - brokenDevices.length,
                      label: "Usable",
                    },
                  ],
                },
              ]}
              width={400}
              height={200}
            />
            <div>Device's broken percentage</div>
          </Space>

          <Space id="chart-container" size={36} direction="vertical" style={{ alignItems: "center" }}>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: reportData.length, label: "Unread" },
                    {
                      id: 1,
                      value: Math.floor(Math.random() * reportData.length * 2),
                      label: "Finished",
                    },
                  ],
                },
              ]}
              width={400}
              height={200}
            />
            <div>Finished report percentage</div>
          </Space>
        </Space>
      </Flex>
    </div>
  );
};

export default Dashboard;
