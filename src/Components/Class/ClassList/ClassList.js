import "./ClassList.css";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Form,
  Modal,
  Input,
  Table,
  Space,
  Button,
  Select,
  message,
  Flex,
} from "antd";
import { EditOutlined, FilterOutlined } from "@ant-design/icons";

import { getScheduleByEmail } from "../../../Constant/Schedule";
import { addNewClass, getClassList } from "../../../Constant/Classrooms";

const ClassTable = (props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const filterFail = (field, value) => {
    messageApi.open({
      type: "error",
      content: `No schedule has ${value} as ${field}`,
    });
  };

  const [classesData, setClassesData] = useState(null);
  const [filterClass, setFilterClass] = useState([]);

  useEffect(() => {
    async function getClassess() {
      let list = await getClassList();
      setClassesData(list);
    }

    if (props.schedule == undefined) {
      getClassess();
    } else {
      let classes = [];

      props.schedule.sort((a, b) => a.startTime - b.startTime);
      props.schedule.map((elem) => {
        let room = {
          id: elem.classroomId,
          time: elem.time,
          subject: elem.subject,
          note: elem.classroom.note,
          status: elem.classroom.status,
          countStudent: elem.countStudent,
          address: elem.classroom.address,
          lastUsed: elem.classroom.lastUsed,
        };

        classes = [...classes, room];
      });

      setClassesData(classes);
    }
  }, []);

  const listAttribute = [
    {
      title: "Classroom",
      dataIndex: "address",
      key: "address",
      render: (text, record) => (
        <Link to={`/detail/classroom/${record.id}`}>{text}</Link>
      ),
    },
    props.schedule && !props.list
      ? {
          title: "Time",
          key: "time",
          render: (record) => (
            <>
              <div>{record.time.split("\n")[0]}</div>
              <div>{record.time.split("\n")[1]}</div>
            </>
          ),
        }
      : {
          title: "Last Used",
          dataIndex: "lastUsed",
          key: "lastUsed",
          render: (text) => (
            <>
              <div>{text.split("T")[0]}</div>
              <div>{text.split("T")[1]}</div>
            </>
          ),
        },
    props.list
      ? {
          title: "Num of devices",
          dataIndex: "facilityAmount",
          key: "facilityAmount",
        }
      : {
          title: "Subject",
          dataIndex: "subject",
          key: "subject",
        },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
  ];

  function onFinishFilter(values) {
    let needFilter = false;
    let filterList = classesData;

    if (values.address) {
      needFilter = true;
      filterList = filterList.filter((elem) =>
        elem.address.includes(values.address)
      );

      if (filterList.length == 0) {
        filterFail("address", values.address);
        return 0;
      }
    }
    if (values.lastUsed) {
      needFilter = true;
      filterList = filterList.filter((elem) =>
        elem.lastUsed.includes(values.lastUsed)
      );

      if (filterList.length == 0) {
        filterFail("last used time", values.lastUsed);
        return 0;
      }
    }
    if (values.facilityAmount) {
      needFilter = true;
      filterList = filterList.filter((elem) =>
        elem.facilityAmount.includes(values.facilityAmount)
      );

      if (filterList.length == 0) {
        filterFail("number of amount", values.facilityAmount);
        return 0;
      }
    }

    if (needFilter) {
      props.setFilter(false);
      setFilterClass(filterList);
    } else {
      props.setFilter(false);
    }
  }

  function cancelFilter() {
    props.setFilter(false);
    setFilterClass([]);
  }

  const handleCancel = () => {
    props.setFilter(false);
  };

  return (
    <>
      <Modal
        title="Filtering Classroom"
        open={props.filter}
        onCancel={handleCancel}
        footer={null}
      >
        <Form name="filteringClassroom" onFinish={onFinishFilter}>
          <Form.Item name="address" style={{ marginTop: 25 }}>
            <Input placeholder="Address" />
          </Form.Item>

          <Form.Item
            name="lastUsed"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input placeholder="Last used time" />
          </Form.Item>

          <Form.Item
            name="facilityAmount"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input placeholder="Number of facilities" />
          </Form.Item>

          <Flex
            style={{ marginTop: 25, marginBottom: 25 }}
            justify="center"
            align="center"
          >
            <Space size={10}>
              <Button type="primary" htmlType="submit">
                Confirm
              </Button>
              <Button type="" onClick={cancelFilter}>
                Cancel Filtering
              </Button>
            </Space>
          </Flex>
        </Form>
      </Modal>
      <Table
        scroll={{ y: props.scroll ? props.scroll : 600 }}
        columns={listAttribute}
        dataSource={filterClass.length == 0 ? classesData : filterClass}
        pagination={{ pageSize: props.pageSize ? props.pageSize : 23 }}
      />
    </>
  );
};

const ClassList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Successfully add new class!",
    });
  };
  const forbidden = () => {
    messageApi.open({
      type: "error",
      content: "Only admin can add classroom!",
    });
  };
  const apiError = () => {
    messageApi.open({
      type: "error",
      content: "Something when wrong please try again later!",
    });
  };

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    async function getSchedule() {
      let schedule = await getScheduleByEmail(user.account.email);
      setSchedule(schedule);
    }
    getSchedule();
  }, []);

  const [isAddClass, setIsAddClass] = useState(false);
  const showAddClassModal = () => {
    if (user.account.role == "ADMIN") {
      setIsAddClass(true);
    } else {
      forbidden();
    }
  };
  const handleCancel = () => {
    setIsAddClass(false);
  };
  const onFinishAdd = (values) => {
    let now = new Date();
    now = now.toISOString();

    let newClass = {
      address: values.address,
      maxSize: values.maxSize,
      status: values.status,
      lastUsed: now,
      note: "",
    };

    setIsAddClass(false);
    addNewClass(newClass).then((res) => {
      if (res.status >= 200 && res.status < 300) {
        success();
      } else {
        apiError();
      }
    });
  };

  const [isFilter, setIsFilter] = useState(false);
  const onFilter = () => {
    setIsFilter(true);
  };

  return (
    <Space direction="vertical" size={50}>
      {contextHolder}
      <Space id="header-container">
        <div class="text-2xl font-bold">Classrooms Information</div>

        <Button style={{ border: "none" }} onClick={onFilter}>
          <FilterOutlined style={{ fontSize: 20 }} />
        </Button>

        <Button style={{ border: "none" }} onClick={showAddClassModal}>
          <EditOutlined style={{ fontSize: 20 }} />
        </Button>
      </Space>

      <div class="px-10">
        <Modal
          title="New Classroom"
          open={isAddClass}
          onCancel={handleCancel}
          footer={null}
        >
          <Form name="addNewClass" onFinish={onFinishAdd}>
            <Form.Item
              style={{ marginTop: 25 }}
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please input class's address!",
                },
              ]}
            >
              <Input
                //prefix={<BankOutlined className="site-form-item-icon" />}
                placeholder="Address"
              />
            </Form.Item>

            <Form.Item
              name="status"
              rules={[
                {
                  required: true,
                  message: "Please input class's status!",
                },
              ]}
            >
              <Select
                placeholder="status"
                options={[
                  {
                    value: "open",
                    label: "Open",
                  },
                  {
                    value: "close",
                    label: "Close",
                  },
                  {
                    value: "fixing",
                    label: "Fixing",
                  },
                ]}
              ></Select>
            </Form.Item>

            <Form.Item
              style={{ marginTop: 25 }}
              name="maxSize"
              rules={[
                {
                  required: true,
                  message: "Please input class's size!",
                },
              ]}
            >
              <Input
                //prefix={<BankOutlined className="site-form-item-icon" />}
                placeholder="Max size: (ex: 100)"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="new-user-form-button"
              >
                Confirm
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {schedule ? (
          <>
            {user.account.role == "ADMIN" ? (
              <ClassTable
                list={true}
                filter={isFilter}
                setFilter={setIsFilter}
              ></ClassTable>
            ) : (
              <ClassTable
                list={true}
                schedule={schedule}
                filter={isFilter}
                setFilter={setIsFilter}
              ></ClassTable>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </Space>
  );
};

export { ClassList as ClassList, ClassTable as ClassTable };
