import React from "react";
import {connect} from "react-redux";
import {Icon, Popconfirm, Popover, Table} from "antd";
import {homeStyle} from "./styles/home";
import {projectListViewStyle} from "./styles/projectListView";
import {fetchJoinedProjectListAction, projectPageLoadingAction} from "../actions/projectList";
import {isStringEmpty} from "../../util/checker";

// 已加入的项目列表
class JoinedProjectListView extends React.Component {

    componentDidMount() {
        this._refreshPage();
    }

    render() {
        return (
            <div style={homeStyle.view_content}>
                <Table
                    bordered
                    dataSource={this.props.projectList}
                    columns={this._buildColumns()}
                    loading={this.props.pageLoading}
                    scroll={{y: true}}
                    pagination={{
                        total: this.props.projectCount,
                        pageSize: this.props.pageSize,
                        current: this.props.pageNum
                    }}
                    onChange={(pagination) => {
                        this.props.pageLoadingVisible(true);
                        this.props.fetchProjectList(pagination.pageSize, pagination.current);
                    }}/>
            </div>
        );
    }

    /**
     * 根据数据构建出各个列
     * @private
     */
    _buildColumns() {
        return [{
            title: '项目',
            dataIndex: 'project',
            width: '15%',
            render: (text) => this._buildProjectInfoView(text),
        }, {
            title: '平台',
            dataIndex: 'platform',
            width: '8%',
            render: (text) => this._buildPlatformView(text),
        }, {
            title: '简介',
            dataIndex: 'des',
            width: '15%',
            render: (text) => (<div>{text}</div>),
        }, {
            title: '创建日期',
            dataIndex: 'createdDate',
            width: '15%',
            render: (text) => (<div>{text}</div>),
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) => this._buildOperationColumn(index),
        }];
    }

    /**
     * 构建表格中行为列
     * @param index
     * @returns {XML}
     * @private
     */
    _buildOperationColumn(index) {
        return (
            <span style={projectListViewStyle.view_operation}>
                <Popconfirm
                    title="确认退出项目?"
                    onConfirm={() => {
                    }}>
                        <a href="#">{'退出项目'}</a>
                </Popconfirm>
            </span>
        )
    }

    /**
     * 构建项目名称和logo column
     * @param info
     * @returns {XML}
     * @private
     */
    _buildProjectInfoView(info) {
        return (
            <div style={projectListViewStyle.view_project}>
                <img
                    style={projectListViewStyle.image_logo}
                    src={isStringEmpty(info.logo) ? '' : info.logo}/>
                <div style={projectListViewStyle.text_project_name}>
                    {info.name}
                </div>
            </div>
        )
    }

    /**
     * 构建平台column
     * @param info 平台相关数据
     * @returns {XML}
     * @private
     */
    _buildPlatformView(info) {
        return (
            <div style={projectListViewStyle.view_platform}>
                <Popover content={info.android} title="Android AppID">
                    <Icon type={'android'}/>
                </Popover>

                <Popover content={info.ios} title="IOS AppID">
                    <Icon type={'apple'}/>
                </Popover>
            </div>
        )
    }

    /**
     * 刷新当前列表数据
     * @private
     */
    _refreshPage() {
        this.props.pageLoadingVisible(true);
        this.props.fetchProjectList(this.props.pageSize, this.props.pageNum);
    }
}

function select(state) {
    const projectList = state.projectList;
    return {
        projectList: projectList.projectList, // 项目列表
        pageSize: projectList.pageSize, // 分页容量
        pageNum: projectList.pageNum, // 当前页码
        projectCount: projectList.projectCount, // 项目总数
        pageLoading: projectList.pageLoading, // 分页loading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchProjectList: (pageSize, pageNum) =>
            dispatch(fetchJoinedProjectListAction(localStorage.uId, pageSize, pageNum)),
        pageLoadingVisible: isLoading => dispatch(projectPageLoadingAction(isLoading))
    }
}

export default connect(select, mapDispatchToProps)(JoinedProjectListView);