## Functions

<dl>
<dt><a href="#init">init([clargs], [opts], [data])</a></dt>
<dd><p>node-d3ck-bstrap uses the following modules et al.:
 <a href="https://github.com/d3ck-org/node-d3ck-cfg">node-d3ck-cfg</a>,
 <a href="https://github.com/d3ck-org/node-d3ck-log">node-d3ck-log</a>,
 <a href="https://github.com/75lb/command-line-args">command-line-args</a>,
and optional <a href="https://github.com/broofa/node-uuid">node-uuid</a>. See the linked documentations for related parameter details and examples.</p>
</dd>
<dt><a href="#usageErr">usageErr([msg])</a></dt>
<dd><p>Print a usage message and exit the node process.</p>
</dd>
<dt><a href="#bstrapErr">bstrapErr(msg)</a></dt>
<dd><p>Log an error and exit the node process.</p>
</dd>
</dl>

<a name="init"></a>
## init([clargs], [opts], [data])
node-d3ck-bstrap uses the following modules et al.:
 [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg),
 [node-d3ck-log](https://github.com/d3ck-org/node-d3ck-log),
 [command-line-args](https://github.com/75lb/command-line-args),
and optional [node-uuid](https://github.com/broofa/node-uuid). See the linked documentations for related parameter details and examples.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [clargs] | <code>object</code> | <code>{}</code> | Options for command line arguments, see the [manual](https://github.com/d3ck-org/node-d3ck-bstrap/blob/master/doc/manual.md) |
| [opts] | <code>object</code> |  | Options (see below) |
| [opts.uuid] | <code>boolean</code> | <code>false</code> | Add a UUID to cfg (needs the [node-uuid](https://github.com/broofa/node-uuid) module) |
| [opts.stage] | <code>string</code> |  | Set the stage (e.g. 'dev'), see the [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg/blob/master/doc/api.md#node-d3ck-cfginitopts-data) API reference and the [manual](https://github.com/d3ck-org/node-d3ck-bstrap/blob/master/doc/manual.md) for stage setting details |
| [opts.cfgDirs] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | Additional cfg directories that contain JSON files, see the [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg/blob/master/doc/api.md#node-d3ck-cfginitopts-data) API reference |
| [opts.verbose] | <code>boolean</code> | <code>false</code> | Enable verbose mode (prints the cfg search path), see the [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg/blob/master/doc/api.md#node-d3ck-cfginitopts-data) API reference |
| [opts.noClargsMerge] | <code>boolean</code> | <code>false</code> | Disable adding of command line arguments to the cfg root level, so access the arguments only with cfg.get('_clargs').xxx |
| [opts.enc] | <code>string</code> | <code>&quot;utf-8&quot;</code> | Encoding of JSON cfg files, see the [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg/blob/master/doc/api.md#node-d3ck-cfginitopts-data) API reference |
| [data] | <code>object</code> | <code>{}</code> | Additional cfg settings, see the [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg/blob/master/doc/api.md#node-d3ck-cfginitopts-data) API reference |

**Example**  
```js
// set stage to 'prod' (reads cfg.json and cfg.prod.json files) and add two directories to cfg search path but no command line arguments and no additional cfg values.
init({}, {stage: 'prod', cfgDirs: ['/home/foo/etc1', '/home/foo/etc2']})
// set stage to 'dev', set 'foo' and 'bar' as additional cfg values but no command line arguments
init({}, {stage: 'dev'}, {'foo': 1, 'bar': 2})
```
<a name="usageErr"></a>
## usageErr([msg])
Print a usage message and exit the node process.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [msg] | <code>string</code> | Print this error message above the usage lines (error mode), skip the message to print only the usage lines (help mode) |

**Example**  
```js
// error mode
usageErr('Missing action')
// help mode
usageErr()
```
<a name="bstrapErr"></a>
## bstrapErr(msg)
Log an error and exit the node process.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>string</code> &#124; <code>Error</code> | Log this error |

**Example**  
```js
bstrapErr('An error occured while boostrapping')
```
