import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { axios, apis, qs, login } from "../api";

const Register = ({ form, location }) => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorHelp, setPasswordErrorHelp] = useState("");
  const [repeatPwd, setRepeatPwd] = useState("");
  const [repeatPwdError, setRepeatPwdError] = useState(false);
  const [repeatPwdErrorHelp, setRepeatPwdErrorHelp] = useState("");
  const { getFieldDecorator } = form;

  const register = async () => {
    if (passwordError || repeatPwdError) {
      return;
    }
    try {
      setLoading(true);
      const { verificationCode } = qs.parse(location.search, {
        ignoreQueryPrefix: true
      });
      const data = await axios.post(
        apis.register,
        qs.stringify({
          password,
          verificationCode
        })
      );
      if (data.code === 0) {
        login(data.data.token);
      } else {
        message.error(data.message);
      }
    } catch (e) {
      message.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError(true);
      setPasswordErrorHelp("请输入密码");
      return false;
    }
    if (password.length < 4 || password.length > 16) {
      setPasswordError(true);
      setPasswordErrorHelp("密码长度在6-16位之间");
      return false;
    }
    setPasswordError(false);
    setPasswordErrorHelp("");
    return true;
  };

  const validateRepeatPwd = () => {
    if (repeatPwd !== password) {
      setRepeatPwdError(true);
      setRepeatPwdErrorHelp("两次输入的密码不一致");
      return false;
    }
    setRepeatPwdError(false);
    setRepeatPwdErrorHelp("");
    return true;
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (validatePassword() && validateRepeatPwd()) {
      await register();
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Item>
        <h2>设置密码</h2>
      </Form.Item>
      <Form.Item
        key={2}
        validateStatus={passwordError ? "error" : ""}
        help={passwordErrorHelp}
      >
        {getFieldDecorator("password", {
          rules: [{ required: true, message: "请输入密码" }]
        })(
          <Input
            onChange={event => setPassword(event.target.value)}
            type={"password"}
            placeholder="请输入密码"
          />
        )}
      </Form.Item>
      <Form.Item
        key={3}
        validateStatus={repeatPwdError ? "error" : ""}
        help={repeatPwdErrorHelp}
      >
        {getFieldDecorator("repeatPwd", {
          rules: [{ required: true, message: "请输入密码" }]
        })(
          <Input
            onChange={event => setRepeatPwd(event.target.value)}
            type={"password"}
            placeholder="请确认密码"
          />
        )}
      </Form.Item>
      <Form.Item key={4}>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          loading={loading}
        >
          完成注册
        </Button>
      </Form.Item>
    </Form>
  );
};

export default withRouter(Form.create()(Register));
