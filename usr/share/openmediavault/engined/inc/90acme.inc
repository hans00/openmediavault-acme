<?php

require_once("openmediavault/functions.inc");

// Register new logfile type
// Sample:
// 2016-01-17 19:34:29,266:DEBUG:acme.cli:Picked account: <Account(eb49da97b040939e9439a6a1c123294c)>
\OMV\System\LogFileSpec::registerSpecification("acme", [
    "filename" => "acme",
    "filepath" => "/root/.acme.sh/acme.sh.log",
    "regex"    => "/^\[([^\[\]]+)\] ([[:print:]]+)$/",
    "columns"  => [
        "ts" => [
            "index" => 1,
            "func"  => create_function('$v', 'return strpdate($v ,"D M  j H:i:s T Y");')
        ],
        "date" => [
            "index" => 1,
            "func"  => create_function('$v', 'return strftime("%c", strpdate($v ,"D M  j H:i:s T Y"));')
        ],
        "message"   => 2
    ]
]);

