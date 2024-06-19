import "./ScheduleList.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Flex,
  Form,
  Modal,
  Input,
  Table,
  Space,
  Select,
  Button,
  message,
} from "antd";
import {
  EditOutlined,
  DownloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";

import {
  addNewSchedule,
  getScheduleByEmail,
  getScheduleList,
  removeSchedule,
  renewSchedule,
} from "../../Constant/Schedule";
import { getClassList } from "../../Constant/Classrooms";
import { getAccList } from "../../Constant/User";

const ScheduleList = () => {
  const nav = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Done!",
    });
  };
  const filterFail = (field, value) => {
    messageApi.open({
      type: "error",
      content: `No schedule has ${value} as ${field}`,
    });
  };
  const apiError = () => {
    messageApi.open({
      type: "error",
      content: "Edit Fail, please try again!",
    });
  };
  const deleteFinish = () => {
    messageApi.open({
      type: "success",
      content: "Done!",
    });
  };
  const deleteFail = () => {
    messageApi.open({
      type: "error",
      content: "Error occur!",
    });
  };

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [filterSchedule, setFilterSchedule] = useState([]);

  const [userList, setUserList] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [classes, setClasses] = useState(null);

  useEffect(() => {
    async function getSchedule() {
      let list = [];
      let options = [];
      let options2 = [];

      let userArr = [];
      let classList = [];

      if (user.account.role == "ADMIN") {
        list = await getScheduleList();

        userArr = await getAccList();
        classList = await getClassList();

        userArr.map((elem) => {
          let option2 = {
            value: elem.accountID,
            label: elem.fullName,
          };

          options2.push(option2);
        });
        setUserList(options2);

        classList.map((elem) => {
          let option = {
            value: elem.id,
            label: elem.address,
          };

          options.push(option);
        });
        setClasses(options);
      } else {
        list = await getScheduleByEmail(user.account.email);
      }

      let classes = [];
      list.map((elem) => {
        let room = {
          id: elem.id,
          subject: elem.subject,
          endTime: elem.endTime,
          startTime: elem.startTime,
          note: elem.classroom.note,
          classId: elem.classroom.id,
          address: elem.classroom.address,
          countStudent: elem.countStudent,
          lecturer: elem.account.user.fullName,
        };

        classes = [...classes, room];
      });

      setSchedule(classes);
    }
    getSchedule();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(schedule);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Schedule");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileName = "schedule.xlsx";
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, fileName);
  };

  const listAttribute = [
    {
      title: "Classroom",
      dataIndex: "address",
      key: "address",
      render: (text, record) => (
        <Link to={`/detail/classroom/${record.classId}`}>{text}</Link>
      ),
    },
    {
      title: "Time",
      key: "time",
      render: (record) => (
        <>
          <div>{record.startTime.split("T")[0]}</div>
          <div>From: {record.startTime.split("T")[1]}</div>
          <div>To: {record.endTime.split("T")[1]}</div>
        </>
      ),
      sorter: (a, b) => new Date(a.startTime) - new Date(b.startTime),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Num of students",
      dataIndex: "countStudent",
      key: "countStudent",
    },
    user.account.role == "ADMIN"
      ? {
          title: "Lecturer",
          key: "lecturer",
          render: (_, record) => <div>{record.lecturer}</div>,
        }
      : {
          title: "Note",
          dataIndex: "note",
          key: "note",
        },
  ];
  if (user.account.role == "ADMIN") {
    listAttribute.push({
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              onEdit(record.id);
            }}
          >
            Edit
          </a>
          <a
            onClick={() => {
              handleDelete(record.id);
            }}
          >
            Delete
          </a>
        </Space>
      ),
    });
  }

  const [isFilter, setIsFilter] = useState(false);
  function onFilter() {
    setIsFilter(true);
  }
  function onFinishFilter(values) {
    let needFilter = false;
    let filterList = schedule;

    if (values.subject) {
      needFilter = true;
      filterList = filterList.filter((elem) =>
        elem.subject.includes(values.subject)
      );

      if (filterList.length == 0) {
        filterFail("subject", values.subject);
        return 0;
      }
    }
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
    if (values.startTime) {
      needFilter = true;
      filterList = filterList.filter((elem) =>
        elem.startTime.includes(values.startTime)
      );

      if (filterList.length == 0) {
        filterFail("start time", values.startTime);
        return 0;
      }
    }
    if (values.endTime) {
      needFilter = true;
      filterList = filterList.filter((elem) =>
        elem.endTime.includes(values.endTime)
      );

      if (filterList.length == 0) {
        filterFail("end time", values.endTime);
        return 0;
      }
    }
    if (values.lecturer) {
      needFilter = true;
      filterList = filterList.filter((elem) =>
        elem.lecturer.includes(values.lecturer)
      );

      if (filterList.length == 0) {
        filterFail("lecturer", values.lecturer);
        return 0;
      }
    }

    if (needFilter) {
      setIsFilter(false);
      setFilterSchedule(filterList);
    } else {
      setIsFilter(false);
    }
  }

  function cancelFilter() {
    setIsFilter(false);
    setFilterSchedule([]);
  }

  function handleDelete(id) {
    removeSchedule(id).then((res) => {
      if (res.status >= 200 && res.status < 300) {
        deleteFinish();
        nav("/schedule");
      } else {
        deleteFail();
      }
    });
  }

  const [isEdit, setIsEdit] = useState(false);
  const [scheduleOnEdit, setScheduleOnEdit] = useState(false);
  function onEdit(id) {
    setScheduleOnEdit(schedule.filter((elem) => elem.id == id)[0]);
    setIsEdit(true);
  }
  function handleCancel() {
    setIsAdd(false);
    setIsEdit(false);
    setIsFilter(false);
  }
  function onFinishEdit(values) {
    let newScheduleInfo = {
      id: scheduleOnEdit.id,
      subject: values.subject,
      classroomId: values.address,
      countStudent: values.countStudent,
      startTime: values.startTime,
      endTime: values.endTime,
    };

    renewSchedule(newScheduleInfo).then((res) => {
      if (res.status >= 200 && res.status < 300) {
        success();
        setIsEdit(false);
      } else {
        apiError();
      }
    });
  }

  const [isAdd, setIsAdd] = useState(false);
  function onAdd() {
    setIsAdd(true);
  }
  function onFinishAdd(values) {
    let newInfo = {
      subject: values.subject,
      accountId: values.accountId,
      classroomId: values.address,
      countStudent: values.countStudent,
      startTime: values.startTime,
      endTime: values.endTime,
    };

    addNewSchedule(newInfo).then((res) => {
      if (res.status >= 200 && res.status < 300) {
        success();
        setIsEdit(false);
      } else {
        apiError();
      }
    });
  }

  return (
    <Space direction="vertical" size={50}>
      <Modal
        title="Filtering Schedule"
        open={isFilter}
        onCancel={handleCancel}
        footer={null}
      >
        <Form name="filteringSchedule" onFinish={onFinishFilter}>
          <Form.Item name="address" style={{ marginTop: 25 }}>
            <Input placeholder="Address" />
          </Form.Item>

          <Form.Item
            name="subject"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input placeholder="Subject" />
          </Form.Item>

          <Form.Item
            name="startTime"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input placeholder="Start at:" />
          </Form.Item>

          <Form.Item
            name="endTime"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input placeholder="End at:" />
          </Form.Item>

          <Form.Item
            name="lecturer"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input placeholder="Lecturer" />
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

      <Modal
        title="Edit Schedule"
        open={isEdit}
        onCancel={handleCancel}
        footer={null}
      >
        <Form name="editSchedule" onFinish={onFinishEdit}>
          <Form.Item
            style={{ marginTop: 25 }}
            name="subject"
            rules={[
              {
                required: true,
                message: "This section is require!",
              },
            ]}
          >
            <Input placeholder={scheduleOnEdit.subject} />
          </Form.Item>

          <Form.Item
            style={{ marginTop: 25 }}
            name="address"
            rules={[
              {
                required: true,
                message: "This section is require!",
              },
            ]}
          >
            <Select
              placeholder={scheduleOnEdit.address}
              options={classes}
            ></Select>
          </Form.Item>

          <Form.Item
            name="countStudent"
            rules={[
              {
                required: true,
                message: "This section is require!",
              },
            ]}
          >
            <Input placeholder={scheduleOnEdit.countStudent} />
          </Form.Item>

          <Form.Item
            name="startTime"
            rules={[
              {
                required: true,
                message: "This section is require!",
              },
            ]}
          >
            <Input placeholder={scheduleOnEdit.startTime} />
          </Form.Item>

          <Form.Item
            name="endTime"
            rules={[
              {
                required: true,
                message: "This section is require!",
              },
            ]}
          >
            <Input placeholder={scheduleOnEdit.endTime} />
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

      <Modal
        title="Add Schedule"
        open={isAdd}
        onCancel={handleCancel}
        footer={null}
      >
        <Form name="addSchedule" onFinish={{onFinishAdd}}>
          <Form.Item
            style={{ marginTop: 25 }}
            name="subject"
            rules={[
              {
                required: true,
                message: "This section is require!",
              },
            ]}
          >
            <Input placeholder="Subject:" />
          </Form.Item>

          <Form.Item
            style={{ marginTop: 25 }}
            name="countStudent"
            rules={[
              {
                required: true,
                message: "This section is require!",
              },
            ]}
          >
            <Input placeholder="Number of students:" />
          </Form.Item>

          <Form.Item
            style={{ marginTop: 25 }}
            name="accountId"
            rules={[
              {
                required: true,
                message: "This section is require!",
              },
            ]}
          >
            <Select placeholder="Lecturer:" options={userList}></Select>
          </Form.Item>

          <Form.Item
            style={{ marginTop: 25 }}
            name="classroomId"
            rules={[
              {
                required: true,
                message: "This section is require!",
              },
            ]}
          >
            <Select placeholder="Location:" options={classes}></Select>
          </Form.Item>

          <Form.Item
            name="startTime"
            rules={[
              {
                required: true,
                message: "This section is require!",
              },
            ]}
          >
            <Input placeholder="Start at:" />
          </Form.Item>

          <Form.Item
            name="endTime"
            rules={[
              {
                required: true,
                message: "This section is require!",
              },
            ]}
          >
            <Input placeholder="End at:" />
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

      <Space id="header-container">
        <div class="text-2xl font-bold">Schedule Information</div>

        <Button style={{ border: "none" }} onClick={onFilter}>
          <FilterOutlined style={{ fontSize: 20 }} />
        </Button>

        <Button style={{ border: "none" }} onClick={onAdd}>
          <EditOutlined style={{ fontSize: 20 }} />
        </Button>

        <Button
          type="default"
          icon={<DownloadOutlined />}
          onClick={exportToExcel}
          style={{
            color: "#000",
            fontWeight: "bold",
            borderRadius: "5px",
            backgroundColor: "#f0f0f0",
          }}
        >
          Export to Excel
        </Button>
      </Space>

      <div class="px-10">
        {schedule ? (
          <Table
            scroll={{ y: 600 }}
            dataSource={filterSchedule.length == 0 ? schedule : filterSchedule}
            columns={listAttribute}
            pagination={{ pageSize: 23 }}
          />
        ) : (
          <></>
        )}
      </div>
    </Space>
  );
};

export default ScheduleList;
