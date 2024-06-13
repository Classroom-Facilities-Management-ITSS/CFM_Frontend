import "./App.css";

import React, { useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useNavigate,
  createBrowserRouter,
} from "react-router-dom";

import {
  Menu,
  Form,
  theme,
  Image,
  Space,
  Modal,
  Input,
  Layout,
  Button,
  message,
  Checkbox,
  Dropdown,
  Breadcrumb,
} from "antd";
import {
  LockOutlined,
  UserOutlined,
  LaptopOutlined,
  SolutionOutlined,
  PoweroffOutlined,
  DashboardOutlined,
  AreaChartOutlined,
  InfoCircleOutlined,
  NotificationOutlined,
} from "@ant-design/icons";

import Dashboard from "../Dashboard/Dashboard.js";
import DeviceDetail from "../Device/DeviceDetail.js";

import ReportSider from "../Report/ReportSider.js";
import ReportList from "../Report/ReportList/ReportList.js";

import UserList from "../User/UserList/UserList.js";
import UserDetail from "../User/UserDetail/UserDetail.js";

import { ClassList } from "../Class/ClassList/ClassList.js";
import ClassDetail from "../Class/ClassDetail/ClassDetail.js";

import useWindowDimensions from "../hook/useWindowDimensions.js";

import { AuthLogin } from "../../Constant/Http.js";
import { getProfile } from "../../Constant/User.js";

const { Header, Content, Sider } = Layout;

const router = createBrowserRouter([
  {
    path: "/classList",
    element: <ClassList></ClassList>,
  },
  {
    path: "/detail/classroom/:classID",
    element: <ClassDetail></ClassDetail>,
  },
]);

const NavBar = (props) => {
  const nav = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const siderItems = [
    {
      key: `dashboard`,
      icon: React.createElement(DashboardOutlined),
      label: `Dashboard`,
      onClick: () => {
        nav("/");
      },
    },
    {
      key: `account`,
      icon: React.createElement(UserOutlined),
      label: `Account`,
      onClick: () => {
        if (props.user.account.role == "ADMIN") {
          nav("/accountList");
        } else {
          nav(`/account/${props.user.accountID}`);
        }
      },
    },
    {
      key: `classrooms`,
      icon: React.createElement(LaptopOutlined),
      label: `Classroom`,
      onClick: () => {
        nav("/classList");
      },
    },
    {
      key: `storage`,
      icon: React.createElement(NotificationOutlined),
      label: `Storage`,
      onClick: () => {
        //nav("/detail/classroom/0");
      },
    },
    {
      key: `reports`,
      icon: React.createElement(AreaChartOutlined),
      label: `Report`,
      onClick: () => {
        nav("/reportList");
      },
    },
  ];

  return (
    <Space
      direction="vertical"
      style={{
        background: colorBgContainer,
      }}
    >
      <Sider width={200}>
        <Menu
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          style={{
            padding: 5,
            height: "100%",
            borderRight: 0,
          }}
          items={siderItems}
        />
      </Sider>
    </Space>
  );
};

const App = () => {
  const { height, width } = useWindowDimensions();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Login successfully, welcomeback Captain!",
    });
  };
  const error = () => {
    messageApi.open({
      type: "error",
      content: "Wrong email or password, please login again!",
    });
  };
  const passConfirmError = () => {
    messageApi.open({
      type: "error",
      content: "Confirm Password must be the same as new password!",
    });
  };

  const [logAccount, setLogAccount] = useState({});
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    let token;

    if (logAccount.email) {
      AuthLogin({ ...logAccount }, {})
        .then(async (data) => {
          success();
          setIsModalOpen(false);

          token = data.data.data;
          localStorage.setItem("token", JSON.stringify(data.data.data));

          getProfile(token).then((data) => {
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
          });
        })
        .catch((err) => {
          error();
        });
    }
  }, [logAccount]);

  const [isModalOpen, setIsModalOpen] = useState(true);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    let logUser = {
      email: values.email,
      password: values.password,
    };
    console.log(logUser);

    setLogAccount(logUser);
  };

  const [isChangePassword, setIsChangePassword] = useState(false);
  const showNewPassModal = () => {
    setIsChangePassword(true);
  };
  const handleNewPassCancel = () => {
    setIsChangePassword(false);
  };
  const onChangedPassword = (values) => {
    if (values.newPassword != values.confirmPassword) {
      passConfirmError();
      return 0;
    }

    let newLoginInfo = {
      id: user.accountID,
      email: values.email,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    };
    console.log(newLoginInfo);

    setIsChangePassword(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const dropdownItems = [
    {
      key: "1",
      label: (
        <Link to={`/account/${user ? user.accountID : 0}`}>
          Account Infomation
        </Link>
      ),
      icon: <InfoCircleOutlined />,
    },
    {
      key: "2",
      label: <div onClick={showNewPassModal}>Change password</div>,
      icon: <SolutionOutlined />,
    },
    {
      key: "3",
      label: (
        <a href="/" onClick={handleLogout}>
          Log out
        </a>
      ),
      icon: <PoweroffOutlined />,
    },
  ];

  return (
    <Layout style={{ minHeight: height, minWidth: width }}>
      {contextHolder}
      {user ? (
        <Modal
          title="Change password"
          open={isChangePassword}
          onCancel={handleNewPassCancel}
          footer={null}
        >
          <Form
            name="changePassword"
            className="login-form"
            onFinish={onChangedPassword}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="oldPassword"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "Please input your new Password!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="New password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please confirm your Password!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Confirm password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      ) : (
        <></>
      )}

      <Header id="layout-header" style={{ backgroundColor: "#6794AE" }}>
        <div>
          <Image
            preview={false}
            style={{ width: 50, display: "inline-block" }}
            src="data:image/png;base64,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"
          />

          <div class="absolute right-10 inline">
            {user ? (
              <Dropdown menu={{ items: dropdownItems }}>
                <Button id="header-btn">
                  <Space>
                    <Image
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${user.accountID}`}
                      width={40}
                      height={40}
                      preview={false}
                    />
                    <div>{user.fullName}</div>
                  </Space>
                </Button>
              </Dropdown>
            ) : (
              <Button onClick={showModal}>Login</Button>
            )}
          </div>
        </div>
      </Header>

      <>
        <Layout>
          <NavBar user={user}></NavBar>

          <Layout
            style={{
              padding: "0 24px 24px",
            }}
          >
            <Breadcrumb
              style={{
                margin: "16px 0",
              }}
            >
              <Breadcrumb.Item></Breadcrumb.Item>
              <Breadcrumb.Item></Breadcrumb.Item>
              <Breadcrumb.Item></Breadcrumb.Item>
            </Breadcrumb>

            <Content
              id="layout-content"
              style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              {user ? (
                <Routes>
                  <Route
                    path={"/accountList"}
                    element={<UserList></UserList>}
                  ></Route>

                  <Route
                    path="/account/:accountID"
                    element={<UserDetail></UserDetail>}
                  ></Route>

                  <Route
                    path="/classList"
                    element={<ClassList></ClassList>}
                  ></Route>

                  <Route
                    path="/detail/classroom/:classID"
                    element={<ClassDetail></ClassDetail>}
                  ></Route>

                  <Route
                    path="/detail/classroom/:classID/device/:deviceID"
                    element={<DeviceDetail></DeviceDetail>}
                  ></Route>

                  <Route path="*" element={<Dashboard></Dashboard>}></Route>

                  <Route
                    path="/reportList"
                    element={<ReportList></ReportList>}
                  ></Route>
                </Routes>
              ) : (
                <Modal
                  title="Login"
                  open={isModalOpen}
                  onCancel={handleCancel}
                  footer={null}
                >
                  <Form
                    name="login"
                    className="login-form"
                    initialValues={{
                      remember: true,
                    }}
                    onFinish={onFinish}
                  >
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Please input your email!",
                        },
                      ]}
                    >
                      <Input
                        prefix={
                          <UserOutlined className="site-form-item-icon" />
                        }
                        placeholder="Email"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Password!",
                        },
                      ]}
                    >
                      <Input
                        prefix={
                          <LockOutlined className="site-form-item-icon" />
                        }
                        type="password"
                        placeholder="Password"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Form.Item
                        name="remember"
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>Remember me</Checkbox>
                      </Form.Item>

                      <Button className="login-form-forgot">
                        Forgot password
                      </Button>
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                      >
                        Log in
                      </Button>
                    </Form.Item>
                  </Form>
                </Modal>
              )}
            </Content>
          </Layout>
          {width < 1500 ? (
            <></>
          ) : (
            <Sider
              width={300}
              style={{
                background: colorBgContainer,
              }}
            >
              {user ? <ReportSider></ReportSider> : <></>}
            </Sider>
          )}
        </Layout>
      </>
    </Layout>
  );
};

export default App;
