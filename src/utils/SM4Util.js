// SM4Util.js
import { sm2, sm3, sm4 } from 'sm-crypto';
// 创建一个请求密钥映射表
const globalKeyMap = new Map();
class SM4Util {

  /**
   * 生成随机SM4密钥（32位十六进制字符串）
   * @returns {string} 16字节的十六进制密钥
   */
  static generateSM4Key() {
    const hexChars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
    }
    return result;
  }

  /**
 * 设置请求密钥（全局）
 * @param {string} requestId - 请求唯一标识
 * @param {string} sm4Key - SM4密钥
 */
  static setRequestKey(requestId, sm4Key) {
    globalKeyMap.set(requestId, sm4Key);
  }

  /**
   * 获取并删除请求密钥（一次性使用）
   * @param {string} requestId - 请求唯一标识
   * @returns {string|null} SM4密钥
   */
  static getAndRemoveRequestKey(requestId) {
    const sm4Key = globalKeyMap.get(requestId);
    if (sm4Key) {
      globalKeyMap.delete(requestId);
    } else {
      console.warn(`未找到请求密钥: ${requestId}`);
    }
    return sm4Key;
  }

  /**
   * SM4加密
   * @param {string} data - 待加密的数据
   * @param {string} key - SM4密钥（32位十六进制字符串）
   * @param {string} mode - 加密模式（cbc/ecb）
   * @returns {string} 加密后的数据
   */
  static sm4Encrypt(data, key, mode = 'ecb') {
    try {
      const encrypted = sm4.encrypt(data, key, { mode: mode });
      return encrypted;
    } catch (error) {
      console.error('SM4加密失败:', error);
      throw new Error('SM4加密失败: ' + error.message);
    }
  }

  /**
   * SM4解密
   * @param {string} encryptedData - 加密的数据
   * @param {string} key - SM4密钥（32位十六进制字符串）
   * @param {string} mode - 解密模式（cbc/ecb）
   * @returns {string} 解密后的数据
   */
  static sm4Decrypt(encryptedData, key, mode = 'ecb') {
    try {
      const decrypted = sm4.decrypt(encryptedData, key, { mode: mode });
      return decrypted;
    } catch (error) {
      console.error('SM4解密失败:', error);
      throw new Error('SM4解密失败: ' + error.message);
    }
  }

  /**
   * SM2加密
   * @param {string} data - 待加密数据
   * @param {string} publicKey - SM2公钥（Base64格式）
   * @param {number} mode - 加密模式（1:C1C3C2, 0:C1C2C3）
   * @returns {string} 加密后的数据（十六进制格式）
   */
  static sm2Encrypt(data, publicKey, mode = 1) {
    try {
      // 使用SM2加密
      const encrypted = sm2.doEncrypt(data, publicKey, mode);
      return encrypted;
    } catch (error) {
      console.error('SM2加密失败:', error);
      throw new Error('SM2加密失败: ' + error.message);
    }
  }

  /**
   * SM3摘要计算
   * @param {string} data - 待计算摘要的数据
   * @returns {string} SM3摘要值
   */
  static sm3Digest(data) {
    try {
      return sm3(data);
    } catch (error) {
      console.error('SM3摘要计算失败:', error);
      throw new Error('SM3摘要计算失败: ' + error.message);
    }
  }

  /**
   * 验证SM3摘要
   * @param {string} data - 原始数据
   * @param {string} digest - 摘要值
   * @returns {boolean} 是否匹配
   */
  static verifySM3Digest(data, digest) {
    try {
      const computedDigest = this.sm3Digest(data);
      return computedDigest === digest;
    } catch (error) {
      console.error('SM3摘要验证失败:', error);
      return false;
    }
  }

 /**
   * 综合加密方法：使用SM4加密数据，SM2加密密钥，SM3生成摘要
   * @param {any} data - 待加密的数据（会自动转换为JSON字符串）
   * @param {string} publicKey - SM2公钥（Base64格式）
   * @param {string} requestId - 请求唯一标识（可选）
   * @returns {Object} 包含加密数据、加密密钥和摘要的对象
   */
  static encryptDataPost(data, publicKey, requestId, id) {
    try {
      // 1. 将数据转换为JSON字符串
      const dataStr = typeof data === 'string' ? data : JSON.stringify(data);

      // 2. 生成随机SM4密钥
      const sm4Key = this.generateSM4Key();
      
      // 3. 如果提供了requestId，存储密钥到全局映射
      if (requestId) {
        this.setRequestKey(requestId, sm4Key);
      }

      // 4. 使用SM4加密数据
      const encryptedData = this.sm4Encrypt(dataStr, sm4Key);

      // 5. 使用SM2加密SM4密钥
      const encryptedKey = this.sm2Encrypt(sm4Key, publicKey);

      // 6. 生成数据摘要
      const digest = this.sm3Digest(dataStr);

      return {
        data_req: encryptedData,
        key_req: encryptedKey,
        digest_req: digest,
        id_req: requestId, // 返回requestId用于解密时匹配
        id: id 
      };
    } catch (error) {
      console.error('综合加密失败:', error);
      throw new Error('综合加密失败: ' + error.message);
    }
  }

  static encryptDataForm(data, publicKey, requestId) {
    try {
      // 1. 生成随机SM4密钥
      const sm4Key = this.generateSM4Key();

      // 2. 如果提供了requestId，存储密钥到全局映射
      if (requestId) {
        this.setRequestKey(requestId, sm4Key);
      }

      // 3. 使用SM4加密数据
      for (let key of data.keys()) {
        if(key != 'file'){
          const dataStr = data.get(key)
          const encryptedData = this.sm4Encrypt(dataStr, sm4Key);
          data.delete(key)
          data.append(key, encryptedData)
        }
      }
      
      // 4. 使用SM2加密SM4密钥
      const encryptedKey = this.sm2Encrypt(sm4Key, publicKey);
      
      data.append("key_req", encryptedKey)
      data.append("id_req", requestId)

      return data;
    } catch (error) {
      console.error('综合加密失败:', error);
      throw new Error('综合加密失败: ' + error.message);
    }
  }

  static encryptDataGet(publicKey, requestId) {
    try {
      // 1. 生成随机SM4密钥
      const sm4Key = this.generateSM4Key();
      
      // 2. 如果提供了requestId，存储密钥到全局映射
      if (requestId) {
        this.setRequestKey(requestId, sm4Key);
      }

      // 3. 使用SM2加密SM4密钥
      const encryptedKey = this.sm2Encrypt(sm4Key, publicKey);
      
      return '?key_req=' + encryptedKey + '&id_req=' + requestId;
    } catch (error) {
      console.error('综合加密失败:', error);
      throw new Error('综合加密失败: ' + error.message);
    }
  }

  /**
   * 综合解密方法：使用SM4密钥解密数据并验证签名
   * @param {Object} encryptedObj - 加密对象（包含data和sign）
   * @param {string} requestIdOrKey - 请求ID或直接的SM4密钥
   * @param {boolean} isRequestId - 是否为请求ID
   * @returns {any} 解密后的数据
   */
  static decryptData(encryptedObj) {
    try {
      // 兼容不同数据结构
      const data = encryptedObj.data;
      const digest = encryptedObj.digest;
      const requestId = encryptedObj.requestId;
      
      let sm4Key

      if (requestId) {
        // 通过请求ID获取并删除密钥（一次性使用）
        sm4Key = this.getAndRemoveRequestKey(requestId);
      }

      if (!sm4Key) {
        throw new Error('未找到有效的SM4密钥');
      }

      // 1. 使用SM4解密数据
      const decryptedData = this.sm4Decrypt(data, sm4Key);
      
      // 2. 验证数据完整性（可选）
      if (digest) {
        const isValid = this.verifySM3Digest(decryptedData, digest);
        if (!isValid) {
          console.warn('数据签名验证失败');
        }
      } else {
        console.warn('未提供签名数据，跳过验证');
      }

      // 3. 尝试解析JSON数据
      try {
        return JSON.parse(decryptedData);
      } catch (e) {
        return decryptedData;
      }
    } catch (error) {
      console.error('综合解密失败:', error);
      throw new Error('综合解密失败: ' + error.message);
    }
  }
}

// 导出全局密钥管理方法
SM4Util.globalKeyMap = globalKeyMap;

export default SM4Util;