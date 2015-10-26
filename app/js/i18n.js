'use strict';

angular.module('zstackUI.i18n', ['pascalprecht.translate'])

.config(['$translateProvider', function($translateProvider) {
  $translateProvider.translations('en', {
    LANGUAGE: "Language",
    SETTINGS: "Settings",
    LOGOUT: "Logut",

    DASHBOARD: 'Dashboard',
    INSTANCE: 'Instance',
    HOST: 'Host',
    IMAGE: 'Image',
    NETWORK: 'Network',
    VOLUME: 'Volume',
    INSTANCE_OFFERING: 'Instance Offering',
    DATA_OFFERING: 'Data Offering',

    ADD: "Add",
    ATTACH: "Attach",
    DETACH: "Detach",
    ENABLE: 'Enable',
    DISABLE: 'Disable',
    DELETE: 'Delete',
    CREATE: 'Create',
    ITEMS_PER_PAGE: 'Items/Page',
    SEARCH: "Search",

    name: 'Name',
    uuid: 'UUID',

    CONFIRM: 'Confirm',
    CONFIRM_STR: "Please type 'ok' to confirm.",


    INSTANCE_CREATE: "Create Instance",
    INSTANCE_START: 'Start',
    INSTANCE_STOP: 'Stop',
    INSTANCE_REBOOT: 'Reboot',
    INSTANCE_DELETE: 'Delete',
    INSTANCE_MIGRATE: 'Migrate',
    INSTANCE_CONSOLE: 'Console',
    INSTANCE_ATTACH_VOLUME: 'Attach Volume',
    INSTANCE_DETACH_VOLUME: 'Dettach Volume',
    INSTANCE_CHANGE_INSTANCE_OFFERING: 'Change Instance Offering',

    IMAGE_ADD: 'Add Image',
    IMAGE_ENABLE: 'Enable',
    IMAGE_DISABLE: 'Disable',
    IMAGE_DELETE: 'Delete',

    HOST_ADD: 'Add Host',
    HOST_RECONNECT: 'Reconnect',
    HOST_MAINTENANCE: 'Enter Maintenance Mode',

    NETWORK_ADD_IP_RANGE: 'Add IP Range',

    VOLUME_ADD: "Add Volume",
    VOLUME_CREATE_IMAGE: "Create Image",

    DATA_OFFERING_ADD: "Add Data Offering",

    INSTANCE_OFFERING_ADD: "Add Instance Offering",
  })
  .translations('zh-CN', {
    LANGUAGE: "语言",
    SETTINGS: "设置",
    LOGOUT: "退出",

    DASHBOARD: '首页',
    INSTANCE: '虚拟机',
    HOST: '物理机',
    IMAGE: '镜像',
    NETWORK: '网络',
    VOLUME: '存储',
    INSTANCE_OFFERING: '系统模板',
    DATA_OFFERING: '存储模板',


    ADD: "添加",
    ATTACH: "加载",
    DETACH: "卸载",
    ENABLE: '启用',
    DISABLE: '停用',
    DELETE: '删除',
    CREATE: '新建',
    ITEMS_PER_PAGE: '项/页',
    SEARCH: "搜索",

    name: '名称',
    uuid: 'UUID',

    CONFIRM: '确认',
    CONFIRM_STR: "请输入'ok'确认操作.",


    INSTANCE_CREATE: "新建虚拟机",
    INSTANCE_START: '启动',
    INSTANCE_STOP: '停止',
    INSTANCE_REBOOT: '重启',
    INSTANCE_DELETE: '删除',
    INSTANCE_MIGRATE: '迁移',
    INSTANCE_CONSOLE: '控制台',
    INSTANCE_ATTACH_VOLUME: '添加存储',
    INSTANCE_DETACH_VOLUME: '移除存储',
    INSTANCE_CHANGE_INSTANCE_OFFERING: '修改配置',

    IMAGE_ADD: '添加镜像',
    IMAGE_ENABLE: '启用',
    IMAGE_DISABLE: '停用',
    IMAGE_DELETE: '删除',


    HOST_ADD: '添加主机',
    HOST_RECONNECT: '重连',
    HOST_MAINTENANCE: '进入维护模式',

    NETWORK_ADD_IP_RANGE: '添加地址空间',

    VOLUME_ADD: "添加存储",
    VOLUME_CREATE_IMAGE: "创建镜像",

    DATA_OFFERING_ADD: "添加存储模板",

    INSTANCE_OFFERING_ADD: "添加系统模板",
  })

  $translateProvider.preferredLanguage('zh-CN');
}]);