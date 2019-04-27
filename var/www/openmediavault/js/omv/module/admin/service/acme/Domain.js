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

Ext.define('OMV.module.admin.service.acme.Domain', {
    extend: 'OMV.workspace.window.Form',
    uses: [
        'OMV.workspace.window.plugin.ConfigObject',
        'OMV.form.plugin.LinkedFields'
    ],

    rpcService: 'ACME',
    rpcGetMethod: 'getDomain',
    rpcSetMethod: 'setDomain',

    plugins: [{
        ptype: 'configobject'
    },{
        ptype: 'linkedfields',
        correlations: [{
            name: ['webroot'],
            conditions: [{
                name: 'validation',
                value: 'webroot'
            }],
            properties: [
                'show',
                '!allowBlank',
                '!readOnly'
            ]
        },{
            name: ['dnsapi'],
            conditions: [{
                name: 'validation',
                value: 'dnsapi'
            }],
            properties: [
                'show',
                '!allowBlank',
                '!readOnly'
            ]
        }]
    }],

    width: 600,

    getFormItems: function () {
        var me = this;
        return [{
            xtype: 'textfield',
            name: 'domain',
            fieldLabel: _('Domain(s)'),
            allowBlank: false,
            plugins: [{
                ptype: 'fieldinfo',
                text: _('Domains the certificate will be generated for and must point to this server, e.g yourdomain.tld, sub.afraid.org.  Wildcard (*) domains are supported if using DNS-Validation.  Separate multiple (sub)domains with a comma (,)')
            }]
        },{
            xtype: 'combo',
            name: 'validation',
            fieldLabel: _('Validation Type'),
            allowBlank: false,
            store: new Ext.data.SimpleStore({
                fields: [ 'value', 'text' ],
                data: [
                    [ 'webroot', _('Web root') ],
                    [ 'dnsapi', _('DNS API') ]
                ]
            }),
            displayField: 'text',
            valueField: 'value',
            editable: false,
            triggerAction: 'all',
            value: 'webroot',
            plugins: [{
                ptype: 'fieldinfo',
                text: _('Choose your validation type.')
            }]
        },{
            xtype: 'textfield',
            name: 'webroot',
            fieldLabel: _('Web root'),
            allowBlank: true,
            readOnly: true,
            hidden: true,
            plugins: [{
                ptype: 'fieldinfo',
                text: _('The root directory of the files served by your internet facing webserver.')
            }]
        },{
            xtype: 'textfield',
            name: 'dnsapi',
            fieldLabel: _('DNS API'),
            allowBlank: true,
            readOnly: true,
            hidden: true,
            plugins: [{
                ptype: 'fieldinfo',
                text: _('Provide the Name of the DNS-API to use for acme.sh.')
            }]
        }];
    }
});

Ext.define('OMV.module.admin.service.acme.Domains', {
    extend: 'OMV.workspace.grid.Panel',
    requires: [
        'OMV.Rpc',
        'OMV.data.Store',
        'OMV.data.Model',
        'OMV.data.proxy.Rpc'
    ],
    uses: [
        'OMV.module.admin.service.acme.Domain'
    ],

    hidePagingToolbar: false,
    stateful: true,
    stateId: 'b70948e4-bb59-11e7-afda-bb34f6129164',
    columns: [{
        xtype: 'textcolumn',
        text: _('Domain(s)'),
        sortable: true,
        dataIndex: 'domain',
        stateId: 'domain',
        flex: 1
    },{
        xtype: 'mapcolumn',
        text: _('Validation Type'),
        sortable: true,
        dataIndex: 'validation',
        stateId: 'validation',
        flex: 1,
        mapItems: {
            'webroot': _('Web root'),
            'dnsapi': _('DNS API')  
        }
    },{
        xtype: 'textcolumn',
        text: _('Web root'),
        sortable: true,
        dataIndex: 'webroot',
        stateId: 'webroot',
        flex: 1
    },{
        xtype: 'textcolumn',
        text: _('DNS API'),
        sortable: true,
        dataIndex: 'dnsapi',
        stateId: 'dnsapi',
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
                        { name: 'validation', type: 'string' },
                        { name: 'webroot', type: 'string' },
                        { name: 'dnsapi', type: 'string' },
                        { name: 'domain', type: 'string' }
                    ]
                }),
                proxy: {
                    type: 'rpc',
                    rpcData: {
                        service: 'ACME',
                        method: 'getDomainList'
                    }
                }
            })
        });
        me.callParent(arguments);
    },

    getTopToolbarItems : function() {
        var me = this;
        var items = me.callParent(arguments);
        Ext.Array.push(items, {
            id: me.getId() + '-certificate',
            xtype: 'button',
            text: _('Certificate'),
            scope: this,
            icon: 'images/certificate.png',
            menu: [{
                text: _('Generate'),
                icon: 'images/add.png',
                handler: Ext.Function.bind(me.onGenerateButton, me, [ me ])
            },{
                text: _('Renew'),
                icon: 'images/reboot.png',
                handler: Ext.Function.bind(me.onRenewButton, me, [ me ])
            }]
        });
        return items;
    },

    onAddButton: function () {
        var me = this;
        Ext.create('OMV.module.admin.service.acme.Domain', {
            title: _('Add domain'),
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
        Ext.create('OMV.module.admin.service.acme.Domain', {
            title: _('Edit domain'),
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
                method: 'deleteDomain',
                params: {
                    uuid: record.get('uuid')
                }
            }
        });
    },

    onGenerateButton: function() {
        var me = this;
        var wnd = Ext.create('OMV.window.Execute', {
            title: _('Generate'),
            rpcService: 'ACME',
            rpcMethod: 'generateCertificate',
            rpcIgnoreErrors: true,
            hideStartButton: true,
            hideStopButton: true,
            listeners: {
                scope: me,
                finish: function(wnd, response) {
                    wnd.appendValue(_('Done...'));
                    wnd.setButtonDisabled('close', false);
                },
                exception: function(wnd, error) {
                    OMV.MessageBox.error(null, error);
                }
            }
        });
        wnd.setButtonDisabled('close', true);
        wnd.show();
        wnd.start();
    },

    onRenewButton: function() {
        var me = this;
        var wnd = Ext.create('OMV.window.Execute', {
            title: _('Renew'),
            rpcService: 'ACME',
            rpcMethod: 'generateCertificate',
            rpcParams: {
                'command': 'renew'
            },
            rpcIgnoreErrors: true,
            hideStartButton: true,
            hideStopButton: true,
            listeners: {
                scope: me,
                finish: function(wnd, response) {
                    wnd.appendValue(_('Done...'));
                    wnd.setButtonDisabled('close', false);
                },
                exception: function(wnd, error) {
                    OMV.MessageBox.error(null, error);
                }
            }
        });
        wnd.setButtonDisabled('close', true);
        wnd.show();
        wnd.start();
    }
});

OMV.WorkspaceManager.registerPanel({
    id: 'domains',
    path: '/service/acme',
    text: _('Domains'),
    position: 10,
    className: 'OMV.module.admin.service.acme.Domains'
});
