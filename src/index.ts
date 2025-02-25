import { parseArgv } from '@serverless-devs/utils';
import { IInputs } from './interface';
import _ from 'lodash';
import FC from './resources/fc';

import Base from './base';
import logger from './logger';

import BuilderFactory, { BuildType } from './subCommands/build';
import Local from './subCommands/local';
import Deploy from './subCommands/deploy';
import Info from './subCommands/info';
import Plan from './subCommands/plan';
import Invoke from './subCommands/invoke';
import Provision from './subCommands/provision';
import Layer from './subCommands/layer';
import Instance from './subCommands/instance';
import Remove from './subCommands/remove';
import Sync from './subCommands/sync';
import Version from './subCommands/version';
import Alias from './subCommands/alias';
import Concurrency from './subCommands/concurrency';
import SYaml2To3 from './subCommands/2to3';
import Logs from './subCommands/logs';

export default class Fc extends Base {
  // 部署函数
  public async deploy(inputs: IInputs) {
    await super.handlePreRun(inputs, true);
    const deploy = new Deploy(inputs);
    const result = await deploy.run();
    console.log(); // 防止最后输出不换行
    return result;
  }

  public async info(inputs: IInputs) {
    await super.handlePreRun(inputs, true);

    const info = new Info(inputs);
    const result = await info.run();
    logger.debug(`Get info: ${JSON.stringify(result)}`);

    return result;
  }

  public async plan(inputs: IInputs) {
    await super.handlePreRun(inputs, true);

    const plan = new Plan(inputs);
    const result = await plan.run();
    logger.debug(`plan result: ${JSON.stringify(result)}`);

    return result;
  }

  public async invoke(inputs: IInputs) {
    await super.handlePreRun(inputs, true);
    const invoke = new Invoke(inputs);
    return await invoke.run();
  }

  public async sync(inputs: IInputs) {
    await super.handlePreRun(inputs, true);
    const sync = new Sync(inputs);
    return await sync.run();
  }

  public async remove(inputs: IInputs) {
    await super.handlePreRun(inputs, true);
    const remove = new Remove(inputs);
    return await remove.run();
  }

  public async version(inputs: IInputs) {
    await super.handlePreRun(inputs, true);
    const v = new Version(inputs);
    return await v[v.subCommand]();
  }

  public async alias(inputs: IInputs) {
    await super.handlePreRun(inputs, true);
    const alias = new Alias(inputs);
    return await alias[alias.subCommand]();
  }

  public async concurrency(inputs: IInputs) {
    await super.handlePreRun(inputs, true);
    const concurrency = new Concurrency(inputs);
    return await concurrency[concurrency.subCommand]();
  }

  public async provision(inputs: IInputs) {
    await super.handlePreRun(inputs, true);
    const provision = new Provision(inputs);
    return await provision[provision.subCommand]();
  }

  public async layer(inputs: IInputs) {
    await super.handlePreRun(inputs, true);
    const layer = new Layer(inputs);
    return await layer[layer.subCommand]();
  }

  public async instance(inputs: IInputs) {
    await super.handlePreRun(inputs, true);
    const instance = new Instance(inputs);
    return await instance[instance.subCommand]();
  }

  public async build(inputs: IInputs) {
    await super.handlePreRun(inputs, false);

    const runtime = _.get(inputs, 'props.runtime');
    if (FC.isCustomContainerRuntime(runtime)) {
      const dockerBuilder = BuilderFactory.getBuilder(BuildType.ImageDocker, inputs);
      await dockerBuilder.build();
    } else {
      const defaultBuilder = BuilderFactory.getBuilder(BuildType.Default, inputs);
      await defaultBuilder.build();
    }
    return {};
  }

  public async local(inputs: IInputs) {
    await super.handlePreRun(inputs, false);

    const { _: command } = parseArgv(inputs.args);
    const subCommand = _.get(command, '[0]');
    if (!subCommand) {
      throw new Error("Please use 's local -h', need specify subcommand");
    }

    const local = new Local();
    if (subCommand === 'start') {
      return await local.start(inputs);
    } else if (subCommand === 'invoke') {
      return await local.invoke(inputs);
    }
    throw new Error("Please use 's local start -h' or 's local invoke -h'");
  }

  public async s2tos3(inputs: IInputs) {
    await super.handlePreRun(inputs, false);
    const trans = new SYaml2To3(inputs);
    return await trans.run();
  }

  public async logs(inputs: IInputs) {
    await super.handlePreRun(inputs, true);
    const logs = new Logs(inputs);
    return await logs.run();
  }
}
