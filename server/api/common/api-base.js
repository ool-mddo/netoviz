import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import toForceSimulationTopologyData from '../../graph/force-simulation'
import { splitAlertHost } from './alert-util'

const asyncReadFile = promisify(fs.readFile)

/**
 * Base class for Server-side API.
 */
class APIBase {
  /**
   * @param {string} distDir - Directory path of distributed resources.
   */
  constructor(distDir) {
    /**
     * Directory path of model files
     * @type{string}
     * @protected
     */
    this.modelDir = `${distDir}/model`
  }

  /**
   * Get all model file information
   * @see static/model/_index.json
   * @returns {Promise<null|Object>} - Model file indexes (`_index.json`)
   * @public
   */
  async getModels() {
    const modelsFile = `${this.modelDir}/_index.json`
    try {
      const buffer = await asyncReadFile(modelsFile)
      return JSON.parse(buffer.toString())
    } catch (error) {
      console.log(error)
      return null
    }
  }

  /**
   * Read graph layout data from layout file.
   * @param {string} jsonName - File name of layout file (json).
   * @returns {Promise<null|LayoutData>} Layout data.
   * @protected
   */
  async readLayoutJSON(jsonName) {
    try {
      // jsonName = <network>/<snapshot>/<file>.json style path
      const dirName = path.dirname(jsonName)
      const layoutJsonName = path.join(this.modelDir, dirName, 'layout.json')
      const buffer = await asyncReadFile(layoutJsonName)
      return JSON.parse(buffer.toString())
    } catch (error) {
      console.log(`Layout file correspond with ${jsonName} was not found.`)
      // layout file is optional.
      // when found (layout file was not found), use default layout.
      return null
    }
  }

  /**
   * Read topology data from json file.
   * @param {string} jsonName - File name of topology json
   * @return {Promise<RfcTopologyData>} Topology data object from file
   * @private
   */
  async _readForceSimulationTopologyDataJSON(jsonName) {
    try {
      const jsonPath = `${this.modelDir}/${jsonName}`
      const buffer = await asyncReadFile(jsonPath)
      return JSON.parse(buffer.toString())
    } catch (error) {
      console.error('Error: cannot read model file: ', jsonName)
      throw error
    }
  }

  /**
   * Convert rfc-topology data to topology data to draw diagram.
   * @param {string} jsonName - File name of rfc-topology data.
   * @returns {Promise<ForceSimulationTopologyData>} topology data for force-simulation diagram.
   * @protected
   */
  async toForceSimulationTopologyData(jsonName) {
    const rfcTopologyData = await this._readForceSimulationTopologyDataJSON(jsonName)
    return toForceSimulationTopologyData(rfcTopologyData)
  }

  /**
   * Convert rfc-topology data to topology data for dependency diagram.
   * @param {string} jsonName - file name of rfc-topology data.
   * @param {Request} req - HTTP request.
   * @returns {Promise<DependencyTopologyData>} Graph data object for nested graph.
   * @abstract
   * @protected
   */
  async toDependencyTopologyData(jsonName, req) {
    /**
     * @typedef {Object} DependencyGraphQuery
     * @prop {string} target
     * @prop {ForceSimulationTopologyData} topologyData
     */
  }

  /**
   * Convert rfc-topology data to topology data for nested diagram.
   * @param {string} jsonName - file name of rfc-topology data.
   * @param {Request} req - HTTP request.
   * @returns {Promise<NestedTopologyData>} Graph data object for nested graph.
   * @abstract
   * @protected
   */
  async toNestedTopologyData(jsonName, req) {
    /**
     * @typedef {Object} NestedGraphQuery
     * @prop {boolean} reverse
     * @prop {number} depth
     * @prop {string} target
     * @prop {string} layer
     * @prop {boolean} aggregate
     * @prop {ForceSimulationTopologyData} topologyData
     * @prop {LayoutData} layoutData
     */
  }

  /**
   * Convert rfc-topology data to topology data for distance diagram.
   * @param {string} jsonName - file name of rfc-topology data.
   * @param {Request} req - HTTP request.
   * @returns {Promise<DistanceTopologyData>} Graph data object for distance graph.
   * @abstract
   * @protected
   */
  async toDistanceTopologyData(jsonName, req) {
    /**
     * @typedef {Object} DistanceGraphQuery
     * @prop {string} target
     * @prop {string} layer
     * @prop {ForceSimulationTopologyData} topologyData
     */
  }

  /**
   * Get converted graph data for web-frontend visualization.
   * @param {string} graphName - Graoh name (type).
   * @param {string} jsonName - Topology data file name (json).
   * @param {Request} req - HTTP request.
   * @returns {Promise<string>} Graph data as JSON format string.
   * @public
   */
  async getGraphData(graphName, jsonName, req) {
    try {
      let data = { error: 'invalid graph name', graphName } // default
      if (graphName === 'forceSimulation') {
        data = await this.toForceSimulationTopologyData(jsonName)
      } else if (graphName === 'dependency') {
        data = await this.toDependencyTopologyData(jsonName, req)
      } else if (graphName === 'nested') {
        data = await this.toNestedTopologyData(jsonName, req)
      } else if (graphName === 'distance') {
        data = await this.toDistanceTopologyData(jsonName, req)
      }
      return JSON.stringify(data)
    } catch (error) {
      // catch-up all exceptions about target/cache file handling.
      console.error(error)
      return JSON.stringify({ error: 'invalid data file', jsonName })
    }
  }

  // delegate
  splitAlertHost(alertHost) {
    return splitAlertHost(alertHost)
  }
}

export default APIBase
