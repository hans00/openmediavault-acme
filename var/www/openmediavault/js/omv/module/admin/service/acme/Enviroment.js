/**
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Volker Theile <volker.theile@openmediavault.org>
 * @author    OpenMediaVault Plugin Developers <plugins@omv-extras.org>
 * @copyright Copyright (c) 2009-2013 Volker Theile
 * @copyright Copyright (c) 2013-2017 OpenMediaVault Plugin Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/grid/Panel.js")
// require("js/omv/workspace/window/Form.js")
// require("js/omv/workspace/window/plugin/ConfigObject.js")
// require("js/omv/Rpc.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")
// require("js/omv/data/proxy/Rpc.js")

Ext.define('OMV.module.admin.service.acme.Env', {
    extend: 'OMV.workspace.window.Form',
    uses: [
        'OMV.workspace.window.plugin.ConfigObject'
    ],

    rpcService: 'ACME',
    rpcGetMethod: 'getEnv',
    rpcSetMethod: 'setEnv',

    plugins: [{
        ptype: 'configobject'
    }],

    width: 600,

    getFormItems: function () {
        var me = this;
        return [{
            xtype: 'fieldset',
            title: _('Enviroment variable'),
            defaults: {
                labelSeparator: ''
            },
            items: [{
                xtype: 'textfield',
                name: 'key',
                fieldLabel: _('Name'),
                allowBlank: false
            },{
                xtype: 'passwordfield',
                name: 'value',
                fieldLabel: _('Value'),
                allowBlank: false
            }]
        },{
            xtype: 'fieldset',
            title: _('Tips'),
            defaults: {
                labelSeparator: ''
            },
            items: [{
                border: false,
                html: _('DNS API validation enviroment, see: ' +
                '<a target="_blank" href="https://github.com/Neilpang/acme.sh/tree/master/dnsapi">https://github.com/Neilpang/acme.sh/tree/master/dnsapi</a>' +
                '<br>e.g.<br><code>CF_Key => sdfsdfsdfljlbjkljlkjsdfoiwje</code>')
            }]
        }];
    }
});

Ext.define('OMV.module.admin.service.acme.Envs', {
    extend: 'OMV.workspace.grid.Panel',
    requires: [
        'OMV.Rpc',
        'OMV.data.Store',
        'OMV.data.Model',
        'OMV.data.proxy.Rpc'
    ],
    uses: [
        'OMV.module.admin.service.acme.Env'
    ],

    hidePagingToolbar: false,
    stateful: true,
    stateId: 'b70948e4-bb59-11e7-afda-bb34f6129165',
    columns: [{
        xtype: 'textcolumn',
        text: _('Name'),
        sortable: true,
        dataIndex: 'key',
        stateId: 'key',
        flex: 1
    }],

    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            store: Ext.create('OMV.data.Store', {
                autoLoad: true,
                model: OMV.data.Model.createImplicit({
                    idProperty: 'uuid',
                    fields: [
                        { name: 'uuid', type: 'string' },
                        { name: 'key', type: 'string' },
                        { name: 'value', type: 'string' }
                    ]
                }),
                proxy: {
                    type: 'rpc',
                    rpcData: {
                        service: 'ACME',
                        method: 'getEnvList'
                    }
                }
            })
        });
        me.callParent(arguments);
    },

    onAddButton: function () {
        var me = this;
        Ext.create('OMV.module.admin.service.acme.Env', {
            title: _('Add env'),
            uuid: OMV.UUID_UNDEFINED,
            listeners: {
                scope: me,
                submit: function () {
                    this.doReload();
                }
            }
        }).show();
    },

    onEditButton: function () {
        var me = this;
        var record = me.getSelected();
        Ext.create('OMV.module.admin.service.acme.Env', {
            title: _('Edit env'),
            uuid: record.get('uuid'),
            listeners: {
                scope: me,
                submit: function () {
                    this.doReload();
                }
            }
        }).show();
    },

    doDeletion: function (record) {
        var me = this;
        OMV.Rpc.request({
            scope: me,
            callback: me.onDeletion,
            rpcData: {
                service: 'ACME',
                method: 'deleteEnv',
                params: {
                    uuid: record.get('uuid')
                }
            }
        });
    }
});

OMV.WorkspaceManager.registerPanel({
    id: 'envs',
    path: '/service/acme',
    text: _('Enviroments'),
    position: 20,
    className: 'OMV.module.admin.service.acme.Envs'
});
