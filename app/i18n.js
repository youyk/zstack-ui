'use strict';

angular.module('zstackUI.i18n', ['pascalprecht.translate'])

.config(['$translateProvider', function($translateProvider) {
  $translateProvider.translations('en', {
    DASHBOARD: 'Dashboard',
    INSTANCE: 'Instance',
    HOST: 'Host',
    IMAGE: 'Image',
    NETWORK: 'Network',
    VOLUME: 'Volume',
    INSTANCE_OFFERING: 'Instance Offering',
    DATA_OFFERING: 'Data Offering',
    INSTANCE_COLLAPSE: 'Collapse',
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

    HOST_ADD: 'Add Host',
    HOST_ENABLE: 'Enable',
    HOST_DISABLE: 'Disable',
    HOST_RECONNECT: 'Reconnect',
    HOST_MAINTENANCE: 'Enter Maintenance Mode',
    HOST_DELETE: 'Delete',

    NETWORK_ADD_IP_RANGE: 'Add IP Range',

    VOLUME_ADD: "Add Volume",

    DATA_OFFERING_ADD: "Add Data Offering",

    INSTANCE_OFFERING_ADD: "Add Instance Offering",
  })
  .translations('zh-CN', {
    DASHBOARD: '首页',
    INSTANCE: '虚拟机',
    HOST: '物理机',
    IMAGE: '镜像',
    NETWORK: '网络',
    VOLUME: '存储',
    INSTANCE_OFFERING: '系统模板',
    DATA_OFFERING: '存储模板',
    INSTANCE_COLLAPSE: '收起',
    INSTANCE_START: '启动',
    INSTANCE_STOP: '停止',
    INSTANCE_REBOOT: '重启',
    INSTANCE_DELETE: '删除',
    INSTANCE_MIGRATE: '迁移',
    INSTANCE_CONSOLE: '打开控制台',
    INSTANCE_ATTACH_VOLUME: '添加存储',
    INSTANCE_DETACH_VOLUME: '移除存储',
    INSTANCE_CHANGE_INSTANCE_OFFERING: '修改系统模板',

    IMAGE_ADD: '添加镜像',

    HOST_ADD: '添加物理机',
    HOST_ENABLE: '启用',
    HOST_DISABLE: '停用',
    HOST_RECONNECT: '重连',
    HOST_MAINTENANCE: '进入维护模式',
    HOST_DELETE: '删除',

    NETWORK_ADD_IP_RANGE: '添加地址空间',

    VOLUME_ADD: "添加存储",

    DATA_OFFERING_ADD: "添加存储模板",

    INSTANCE_OFFERING_ADD: "添加系统模板",
  })

  $translateProvider.preferredLanguage('zh-CN');
}]);