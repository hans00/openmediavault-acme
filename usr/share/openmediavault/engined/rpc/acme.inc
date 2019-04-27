<?php
/**
 * Copyright (c) 2015-2017 OpenMediaVault Plugin Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

require_once('openmediavault/functions.inc');

class OMVRpcServiceACME extends \OMV\Rpc\ServiceAbstract
{
    public function getName()
    {
        return 'ACME';
    }

    public function initialize()
    {
        $this->registerMethod('getSettings');
        $this->registerMethod('setSettings');

        $this->registerMethod('getEnvList');
        $this->registerMethod('getEnv');
        $this->registerMethod('setEnv');
        $this->registerMethod('deleteEnv');

        $this->registerMethod('getDomainList');
        $this->registerMethod('getDomain');
        $this->registerMethod('setDomain');
        $this->registerMethod('deleteDomain');

        $this->registerMethod('generateCertificate');
    }

    /**
     * Get the settings of the service.
     *
     * @param array $params The method paramaters.
     * @param array $context The context of the caller.
     * @return mixed
     *
     * @throws DatabaseException
     */
    public function getSettings($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Get the configuration object.
        $db = \OMV\Config\Database::getInstance();
        $object = $db->get('conf.service.acme');
        return $object->getAssoc();
    }

    /**
     * Set the settings of the service.
     *
     * @param array $params The method paramaters.
     * @param array $context The context of the caller.
     * @return mixed
     *
     * @throws DatabaseException
     */
    public function setSettings($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, 'rpc.acme.setsettings');
        // Get the existing configuration object.
        $db = \OMV\Config\Database::getInstance();
        $object = $db->get('conf.service.acme');
        $object->setAssoc($params);
        $db->set($object);
        // Return the configuration object.
        return $object->getAssoc();
    }

    public function getEnvList($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, 'rpc.common.getlist');
        // Get the configuration object.
        $db = \OMV\Config\Database::getInstance();
        $objects = $db->getAssoc('conf.service.acme.env');
        // Filter the result.
        return $this->applyFilter($objects, $params['start'], $params['limit'],
            $params['sortfield'], $params['sortdir']);
    }

    public function getEnv($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, 'rpc.common.objectuuid');
        // Get the configuration object.
        $db = \OMV\Config\Database::getInstance();
        return $db->getAssoc('conf.service.acme.env', $params['uuid']);
    }

    public function setEnv($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, 'rpc.acme.setenv');
        // Prepare the configuration object.
        $object = new \OMV\Config\ConfigObject('conf.service.acme.env');
        $object->setAssoc($params);
        // Set the configuration object.
        $isNew = $object->isNew();
        $db = \OMV\Config\Database::getInstance();
        if (TRUE === $isNew) {
            // Check uniqueness - web root
            $db->assertIsUnique($object, 'key');
        }
        $db->set($object);
        // Return the configuration object.
        return $object->getAssoc();
    }

    public function deleteEnv($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, 'rpc.common.objectuuid');
        // Delete the configuration object.
        $db = \OMV\Config\Database::getInstance();
        $object = $db->get('conf.service.acme.env', $params['uuid']);
        $db->delete($object);
        // Return the deleted configuration object.
        return $object->getAssoc();
    }

    public function getDomainList($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, 'rpc.common.getlist');
        // Get the configuration object.
        $db = \OMV\Config\Database::getInstance();
        $objects = $db->getAssoc('conf.service.acme.domain');
        // Filter the result.
        return $this->applyFilter($objects, $params['start'], $params['limit'],
            $params['sortfield'], $params['sortdir']);
    }

    public function getDomain($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, 'rpc.common.objectuuid');
        // Get the configuration object.
        $db = \OMV\Config\Database::getInstance();
        return $db->getAssoc('conf.service.acme.domain', $params['uuid']);
    }

    public function setDomain($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, 'rpc.acme.setdomain');
        // Prepare the configuration object.
        $object = new \OMV\Config\ConfigObject('conf.service.acme.domain');
        $object->setAssoc($params);
        // Set the configuration object.
        $isNew = $object->isNew();
        $db = \OMV\Config\Database::getInstance();
        if (TRUE === $isNew) {
          if ($domainv->get('validation') == 'webroot') {  
            // Check uniqueness - web root (only if webroot is used)
            $db->assertIsUniqueByFilter($object, [
                'operator' => 'and',
                'arg0' => [
                    'operator' => 'stringEquals',
                    'arg0' => 'validation',
                    'arg1' => $object->get('validation')
                ],
                'arg1' => [
                    'operator' => 'stringEquals',
                    'arg0' => 'webroot',
                    'arg1' => $object->get('webroot')
                ]
            ]);
          }       
        }
        db->set($object);
        // Return the configuration object.
        return $object->getAssoc();
    }

    public function deleteDomain($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, 'rpc.common.objectuuid');
        // Delete the configuration object.
        $db = \OMV\Config\Database::getInstance();
        $object = $db->get('conf.service.acme.domain', $params['uuid']);
        $db->delete($object);
        // Return the deleted configuration object.
        return $object->getAssoc();
    }

    public function generateCertificate($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Generate the letsencrypt certificates
        // Create the background process.
        return $this->execBgProc(function($bgStatusFilename, $bgOutputFilename)
            use ($params, $context) {
                // Get the configuration object.
                $db = \OMV\Config\Database::getInstance();
                $object = $db->get('conf.service.acme');
                $domains = $db->get('conf.service.acme.domain');
                $envs = $db->get('conf.service.acme.env');
                $certObjects = $db->getByFilter(
                    'conf.system.certificate.ssl', [
                        'operator' => 'stringEquals',
                        'arg0' => 'uuid',
                        'arg1' => $object->get('certuuid')
                    ]
                );
                if (count($certObjects) > 0) {
                    $certExists = true;
                    $certuuid = $object->get('certuuid');
                } else {
                    $certExists = false;
                    $certuuid = \OMV\Environment::get('OMV_CONFIGOBJECT_NEW_UUID');
                }
                // execute certbot
                $certName = explode(',', reset($domains)->get('domain'))[0];
                $issue = false;
                $cmdArgs = [];
                if (($params['command'] == 'renew') && ($certExists == true)) {
                    $cmdArgs[] = '--renew-all';
                } else {
                    $issue = true;
                    $cmdArgs[] = '--issue';
                    if ($object->get('test_cert')) {
                        $cmdArgs[] = '--test';
                    }
                    if ($certExists) {
                        $cmdArgs[] = '--force';
                    }
                    foreach ($domains as $domaink => &$domainv) {
                        // convert domain list to array
                        $domains2 = explode(',', $domainv->get('domain'));
                        // generate domain parameters
                        if ($domainv->get('validation') == 'webroot') {
                            $cmdArgs[] = sprintf('--webroot %s',
                                $domainv->get('webroot')
                            );
                        } else {
                            $cmdArgs[] = sprintf('--dns %s',
                                $domainv->get('dnsapi')
                            );
                        }
                        foreach ($domains2 as $domain) {
                            $cmdArgs[] = sprintf('-d %s', escapeshellarg(trim($domain)));
                        }
                    }
                    if (!empty($object->get('extraoptions'))) {
                        $cmdArgs[] = escapeshellarg($object->get('extraoptions'));
                    }
                }
                $cmdArgs[] = '--log /opt/acme/acme.sh.log';
                $cmdArgs[] = '--home /opt/acme';
                $cmd = new \OMV\System\Process('/opt/acme/acme.sh', $cmdArgs);
                $cmd->setRedirect2to1(true);
                // Enviroments
                $cmd->setEnv('ACCOUNT_EMAIL', $object->get('email'));
                foreach ($envs as $envk => &$env) {
                    $cmd->setEnv(escapeshellarg($env->get('key')), escapeshellarg($env->get('value')));
                }
                $cmdLine = $cmd->getCommandLine();
                $this->writeBgProcOutput($bgOutputFilename, sprintf('Command: %s', $cmdLine));
                if ($certExists == true) {
                    $this->writeBgProcOutput($bgOutputFilename, PHP_EOL);
                    $this->writeBgProcOutput($bgOutputFilename, sprintf('Cert exists: %s', $certExists));
                }
                $this->writeBgProcOutput($bgOutputFilename, PHP_EOL.PHP_EOL);
                $this->exec($cmdLine, $output, $bgOutputFilename);
                // Without update cert in testing mode
                if (!$object->get('test_cert')) {
                    // Replace cert if not testing
                    $liveDir = '/opt/acme';
                    $keyFile = sprintf('%s/%s/%s.key', $liveDir, $certName, $certName);
                    $crtFile = sprintf('%s/%s/fullchain.cer', $liveDir, $certName);
                    if (file_exists($keyFile) && file_exists($crtFile)) {
                        // Read certificate and key content
                        // Import generated certificate.
                        $cert = OMV\Rpc\Rpc::call('CertificateMgmt', 'set', [
                            'uuid' => $certuuid,
                            'certificate' => file_get_contents($crtFile),
                            'privatekey' => file_get_contents($keyFile),
                            'comment' => sprintf('ACME - %s (%s)', $certName, date('Ymd'))
                        ], $context);
                        if (is_uuid($cert['uuid'])) {
                            $object->set('certuuid', $cert['uuid']);
                        }
                        // Resave the configuration data now with a new cert uuid
                        $new = OMV\Rpc\Rpc::call('ACME', 'setSettings',
                            $object->getAssoc(), $context
                        );
                         // Apply changes immmediately
                        \OMV\Rpc\Rpc::call('Config', 'applyChanges', [
                            'modules' => [ 'certificatemgmt' ],
                            'force' => TRUE
                        ], $context);
                    }
                    // Create cron job if enabled
                    $cmd = new \OMV\System\Process('omv-mkconf', 'acme');
                    $cmd->setRedirect2to1();
                    $cmd->execute();
                }

                return $output;
            }
        );
    }
}
