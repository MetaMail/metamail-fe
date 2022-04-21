import { Tag, Input, Tooltip, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { IPersonItem } from '../home/interfaces';

interface IReceiverGroupProps {
  receivers: IPersonItem[];
  onReceiversChange: (newAddress: string[]) => void;
}

export default class ReceiverGroup extends React.Component<IReceiverGroupProps> {
  input: any;
  editInput: any;
  onChange: (newAddress: string[]) => void;

  constructor(props: IReceiverGroupProps) {
    super(props);
    this.onChange = props.onReceiversChange;
    this.state = {
      tags: props.receivers.map((item) => {
        return item.address;
      }),
      inputVisible: false,
      inputValue: '',
      editInputIndex: -1,
      editInputValue: '',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const tags = nextProps.receivers.map((item) => {
      return item.address;
    });

    if (JSON.stringify(tags) !== JSON.stringify(prevState.tags)) {
      return { tags };
    }
    return null;
  }

  handleClose = (removedTag: string) => {
    const tags = this.state.tags.filter((tag) => tag !== removedTag);
    // this.setState({ tags });
    this.onChange(tags);
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e: { target: { value: any } }) => {
    this.setState({ inputValue: e.target.value });
  };

  validEmailAddress = (input: string) => {
    return new RegExp(
      /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/g,
    ).test(input);
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      if (!this.validEmailAddress(inputValue)) {
        notification.warn({
          message: 'Invalid address',
          description: ` ${inputValue} is not a valid address.`,
        });
      } else {
        tags = [...tags, inputValue];
        this.onChange(tags);
      }
      this.setState({
        // tags,
        inputVisible: false,
        inputValue: '',
      });
    }
  };

  handleEditInputChange = (e: { target: { value: any } }) => {
    this.setState({ editInputValue: e.target.value });
  };

  handleEditInputConfirm = () => {
    const { editInputValue, editInputIndex, tags } = this.state;
    if (!this.validEmailAddress(editInputValue)) {
      notification.warn({
        message: 'Invalid address',
        description: ` ${editInputValue} is not a valid address.`,
      });
    } else {
      tags[editInputIndex] = editInputValue;
      this.onChange(tags);
    }

    this.setState({
      editInputIndex: -1,
      editInputValue: '',
    });
  };

  saveInputRef = (input: any) => {
    this.input = input;
  };

  saveEditInputRef = (input: any) => {
    this.editInput = input;
  };

  render() {
    const { tags, inputVisible, inputValue, editInputIndex, editInputValue } =
      this.state;

    return (
      <>
        {tags.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                ref={this.saveEditInputRef}
                key={tag}
                size="small"
                value={editInputValue}
                onChange={this.handleEditInputChange}
                onBlur={this.handleEditInputConfirm}
                onPressEnter={this.handleEditInputConfirm}
              />
            );
          }

          const isLongTag = tag.length > 20;

          const tagElem = (
            <Tag key={tag} closable onClose={() => this.handleClose(tag)}>
              <span
                onDoubleClick={(e) => {
                  this.setState(
                    { editInputIndex: index, editInputValue: tag },
                    () => {
                      this.editInput.focus();
                    },
                  );
                  e.preventDefault();
                }}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}

        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag onClick={this.showInput}>
            <PlusOutlined /> New Receiver
          </Tag>
        )}
      </>
    );
  }
}
