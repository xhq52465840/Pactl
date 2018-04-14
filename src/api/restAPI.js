'use strict';
module.exports = ['$resource',
  function ($resource) {
    var ddic = '/api/ddic';
    var org = '/api/org';
    var pactl = '/api/pactl';
    var pactlorg = '/api/pactlorg';
    var mail = '/api/mail';
    var wechat = '/api/wechat';
    return {
      login: $resource('/api/sso/login'),
      logout: $resource('/api/sso/logout'),
      imgCode: $resource('/api/sso/imageCode'),
      createQrCode: $resource('/api/wechat/wechat/qrcode/create'),
      getQrCode: $resource('/api/wechat/wechat/qrcode/getQrcodeImage', {}, {
        getString: {
          method: 'GET',
          transformResponse: function (data) {
            return {
              data: data
            };
          }
        }
      }),
      requestSceneId: $resource('/api/wechat/wechat/qrcode/check', {}, {
        get: {
          method: 'GET',
          timeout: 3 * 60 * 1000
        }
      }),
      binding: $resource('/api/wechat/wechat/bind/create'),
      searchUnits: $resource('/api/wechat/wechat/bind/searchUnits'),
      weChat: {
        getAgentAll: $resource(':/wechat/agent/listMyUnits/:token'),
        getAgentDefualt: $resource(':/wechat/agent/getDefault/:token'),
        setAgentDefualt: $resource('/wechat/agent/updateDefault/:token/agentId')
      },
      agent: {
        agent: $resource(pactlorg + '/tokens/aa'),
        myAgent: $resource(pactlorg + '/tokens/listMyOpAgents/:token'),
        myUnits: $resource(pactlorg + '/tokens/listMyUnits/:token'),
        myOpAgents: $resource(pactlorg + '/tokens/listMyOpAgents/:token'),
        allAgents: $resource(pactlorg + '/tokens/listAllOpAgents'),
        upOpAgent: $resource(pactlorg + '/saleagents/listMyOpAgents/:id'),
        saleAgents: $resource(pactlorg + '/saleagents/listSaleAgentsByOpUnit/:id'),
        listOper: $resource(pactlorg + '/saleagents/listOper')
      },
      /******************以下为pactl接口***********************/
      // 卡车
      car: {
        queryAll: $resource(pactl + '/truck/storage/queryone'),
        getCarByNo: $resource(pactl + '/truck/storage/wbinfo'),
        addCar: $resource(pactl + '/truck/storage/iou'),
        delAll: $resource(pactl + '/truck/storage/deleteall'),
        delCar: $resource(pactl + '/truck/storage/delete'),
        printRemark: $resource(pactl + '/truck/storage/printed'),
        carCode: $resource(pactl + '/truck/storage/queryBarCode')
      },
      // 条形码
      code: {
        oneBarCode: $resource(pactl + '/onebarcode'),
        onebarcodes: $resource(pactl + '/onebarcodes')
      },
      // 鉴定机构
      officeInfo: {
        addOffice: $resource(pactl + '/office/addofficeinfo'),
        queryDetail: $resource(pactl + '/office/getofficeinfo'),
        queryAll: $resource(pactl + '/office/getofficeinfos'),
        editOffice: $resource(pactl + '/office/updateofficeinfo'),
        delairdelay: $resource(pactl + '/office/delairdelay'),
        updateairdelay: $resource(pactl + '/office/updateairdelay'),
        disable: $resource(pactl + '/office/disableofficeinfo')
      },
      // 获取基本数据
      baseData: {
        queryAll: $resource(pactl + '/comm/dict/list')
      },
      // 航空数据
      airData: {
        getDataByCode: $resource(pactl + '/airport/code'),
        queryAll: $resource(pactl + '/air/line/queryall'),
        queryList: $resource(pactl + '/air/line/querylist'),
        queryOne: $resource(pactl + '/air/line/query'),
        addAir: $resource(pactl + '/air/line/iou'),
        delAir: $resource(pactl + '/air/line/delete'),
        disable: $resource(pactl + '/air/line/stop'),
        enable: $resource(pactl + '/air/line/start'),
        addMsg: $resource(pactl + '/message/address/iou'),
        queryMsg: $resource(pactl + '/message/address/query'),
        disableMsg: $resource(pactl + '/message/address/stop'),
        enableMsg: $resource(pactl + '/message/address/start'),
        delMsg: $resource(pactl + '/message/address/delete'),
        addAgent: $resource(pactl + '/air/line/relate'),
        queryAgent: $resource(pactl + '/air/line/query/officeInfo'),
        delAgent: $resource(pactl + '/air/line/change/officeInfo'),
        queryParams: $resource(pactl + '/air/line/params'),
      },
      rule: {
        queryList: $resource(pactl + '/distribute/rule/querylist'),
        editRule: $resource(pactl + '/distribute/rule/iou'),
        delRule: $resource(pactl + '/distribute/rule/delete')
      },
      bookRule: {
        queryList: $resource(pactl + '/inspection/rules/querylist'),
        editBook: $resource(pactl + '/inspection/rules/iou'),
        delBoOk: $resource(pactl + '/inspection/rules/delete')
      },
      // 国家
      country: {
        queryAll: $resource(pactl + '/country/queryall'),
        queryList: $resource(pactl + '/country/querylist'),
        addCountry: $resource(pactl + '/country/iou'),
        delCountry: $resource(pactl + '/country/change/status')
      },
      // 机场
      airPort: {
        queryAll: $resource(pactl + '/airport/queryall'),
        query: $resource(pactl + '/airport/query'),
        queryList: $resource(pactl + '/airport/querylist'),
        delAirPort: $resource(pactl + '/airport/delete'),
        editAirPort: $resource(pactl + '/airport/iou'),
        disable: $resource(pactl + '/airport/stop'),
        enable: $resource(pactl + '/airport/start')
      },
      // 代理证书
      book: {
        bookList: $resource(pactl + '/books/agentsbs'),
        addLabels: $resource(pactl + '/books/addlabels'),
        addLabels2: $resource(pactl + '/books/addlabels2'),
        bookPublicList: $resource(pactl + '/books/commagentsbs'),
        querydelaylist: $resource(pactl + '/books/getdelaysblist'),
        addBookList: $resource(pactl + '/books/addagentsb'),
        changeTag: $resource(pactl + '/books/changelabels'),
        addAgent: $resource(pactl + '/books/accagentsales'),
        addAgent2: $resource(pactl + '/books/accagentsales2'),
        cancelAgent: $resource(pactl + '/books/unaccagentsales'),
        removeBook: $resource(pactl + '/books/delagentsb'),
        disableBook: $resource(pactl + '/books/disagentsb'),
        concernBook: $resource(pactl + '/books/commbooksfocus'),
        aduitList: $resource(pactl + '/books/getauditsblist'),
        auditInfo: $resource(pactl + '/books/getauditsbinfo'),
        audit: $resource(pactl + '/books/auditagentsb'),
        next: $resource(pactl + '/books/getauditsbinfo'),
        recent: $resource(pactl + '/books/keepsbinfo'),
        bookPactlList: $resource(pactl + '/books/pactlquerysblist'),
        receiveBook: $resource(pactl + '/books/receiveagentsb'),
        recentBook: $resource(pactl + '/books/keepagentsb'),
        accagentoprn: $resource(pactl + '/books/accagentoprn'),
        getkeepInfo: $resource(pactl + '/books/getkeepagentsb'),
        opCertAuditEdit: $resource(pactl + '/books/mpactlsba'),
        opCertAuditDel: $resource(pactl + '/books/delpactlsba'),
        airdelay: $resource(pactl + '/books/smairdelayforbooks'),
        updatekeepagentsb: $resource(pactl + '/books/updatekeepagentsb'),
        delayAirline: $resource(pactl + '/books/smairdelayforbooks'),
        delayAirline2: $resource(pactl + '/books/smairdelayforbooks2'),
        checkBookByOprn: $resource(pactl + '/books/checkbookbyoprn'),
        delairdelayforbooks: $resource(pactl + '/books/delairdelayforbooks'),
        isAudit: $resource(pactl + '/books/isAudit')
      },
      author: {
        authorization: pactl + '/report/authorization'
      },
      charts: {
        approach: $resource(pactl + '/report/pactl/approach'),
        security: $resource(pactl + '/report/pactl/security'),
        waybill: $resource(pactl + '/report/pactl/waybill'),
        agentWaybill: $resource(pactl + '/report/agent/waybill'),
        agentSecurity: $resource(pactl + '/report/agent/security'),
        securityRecheck: $resource(pactl + '/report/security/recheck'),
        statistics: $resource(pactl + '/report/pactl/statistics'),
        agentStatistics: $resource(pactl + '/report/agent/statistics'),
        agentApproachQueue: $resource(pactl + '/report/agent/approach/queue')
      },
      hislog: {
        hislogs: $resource(pactl + '/comm/hislogs')
      },
      // 运单操作代理更换审核
      auditOprn: {
        querylist: $resource(pactl + '/wb/queryauditlist'),
        change: $resource(pactl + '/wb/auditchangeagent')
      },
      //agent 品名证书
      nameAdvice: {
        nameAdviceSet: $resource(pactl + '/gad/gadlist'),
        addAdvice: $resource(pactl + '/gad/smgad'),
        shippingview: $resource(pactl + '/waybillview/shippingview'),
        updateAgentSystem: $resource(pactl + '/agent/system/set/update'),
        queryAgentSystem: $resource(pactl + '/agent/system/set/query'),
        queryAgentSystemByAwid: $resource(pactl + '/agent/system/set/query/:awId'),
        queryForType:$resource(pactl+'/agent/system/set/queryType/:awId')
      },
      // pactl 安保部门退运
      security: {
        getDate: $resource(pactl + '/waybillview/returnbillview'),
        saveWaybillview: $resource(pactl + '/waybillview/checkreturn'),
        cancelWaybillview: $resource(pactl + '/waybillview/cancel/checkreturn')
      },
      //pactl 品名证书
      pactlAdvice: {
        editAdviceSet: $resource(pactl + '/gad/pactlgadlist')
      },
      //根据咨询编号进入咨询界面和回复界面
      goodsId: {
        goodsIdSet: $resource(pactl + '/gad/gadone'),
        goodsIdResult: $resource(pactl + '/gad/pactlmgad'),
        historys: $resource(pactl + '/comm/hislogs')
      },
      //咨询界面、批量禁用，停用
      refer: {
        referSet: $resource(pactl + '/gad/smgka'),
        addAdvice: $resource(pactl + '/gad/smgad'),
        forbidden: $resource(pactl + '/gad/disgad')
      },
      //删除品名咨询
      delnameAdvice: {
        delnameAdvice: $resource(pactl + '/gad/delgad')
      },
      // 回复模板列表查询
      tempReply: {
        tempReply: $resource(pactl + '/gad/pmlist')
      },
      //回复模板新增修改
      tempReplydlog: {
        tempReplydlog: $resource(pactl + '/gad/smpm')
      },
      tempReplyDelete: {
        tempReplyDelete: $resource(pactl + '/gad/delpm')
      },
      //删除文件
      file: {
        removeFile: $resource(pactl + '/gad/delgadfile'),
        uploadFile: pactl + '/uploadfile',
        uploadfilepdf: pactl + '/uploadfilepdf',
        downloadFile: pactl + '/downloadfile'
      },
      //标签
      tag: {
        tagList: $resource(pactl + '/agentlabel/queryList'),
        addTag: $resource(pactl + '/agentlabel/addorupdate'),
        delTag: $resource(pactl + '/agentlabel/deleteByKey'),
        getTagStatus: $resource(pactl + '/agentlabel/deleteByKey'),
        exportExl: pactl + '/agentlabel/expexcel'
      },
      //运单
      bill: {
        checkBill: $resource(pactl + '/wb/checkwbno'),
        billList: $resource(pactl + '/wb/wblist'),
        mainWaybill: $resource(pactl + '/comm/query/history'),
        subWaybill: $resource(pactl + '/comm/query/sub/history'),
        billInfo: $resource(pactl + '/wb/wbinfo'),
        ckwbinfo: $resource(pactl + '/wb/ckwbinfo'),
        saveBill: $resource(pactl + '/wb/addwb'),
        updateBill: $resource(pactl + '/wb/updatewb'),
        delBill: $resource(pactl + '/wb/delwb'),
        saveBillTemp: $resource(pactl + '/wb/smwbm'),
        billTempList: $resource(pactl + '/wb/wbmlist'),
        delBillTemp: $resource(pactl + '/wb/delwbm'),
        billTempById: $resource(pactl + '/wb/getwbm'),
        billAudit: $resource(pactl + '/wb/commitaudit'),
        billAudit2: $resource(pactl + '/wb/commitaudit2'),
        list: $resource(pactl + '/waybillview/view'),
        recentlyData: $resource(pactl + '/wb/wblog'),
        iata: $resource(pactl + '/wb/user/detail'),
        countAll: $resource(pactl + '/waybillview/count')
      },
      // 分运单
      subBill: {
        billList: $resource(pactl + '/wb/subwblist'),
        checksubwbno: $resource(pactl + '/wb/checksubwbno'),
        getMasterBill: $resource(pactl + '/wb/wbinfo2'),
        modifyEle: $resource(pactl + '/precheck/modifyEle')
      },
      // 安检复检
      reCheck: {
        checkList: $resource(pactl + '/scheck/checkmsgByWaybillno'),
        queryList: $resource(pactl + '/scheck/checkmsg'),
        addPrompt:$resource(pactl + '/scheck/addPrompt'),
        queryPromptByAwId:$resource(pactl + '/scheck/queryPromptByAwId'),
        waitList: $resource(pactl + '/scheck/checkmsgs'),
        saveRecheck: $resource(pactl + '/scheck/updateStatusList'),
        updateStatus: $resource(pactl + '/scheck/updateStatus'),
        addRemrak: $resource(pactl + '/scheck/addRemrak'),
        updateRemrak: $resource(pactl + '/scheck/updateRemrak'),
        remarkList: $resource(pactl + '/scheck/getRemraks'),
        remarks: $resource(pactl + '/scheck/getRemrakByAWID'),
        delRemark: $resource(pactl + '/scheck/delRemark/:id', {}, {
          remove: {
            method: 'POST'
          }
        }),
        getBookByBookID: $resource(pactl + '/scheck/getBookByBookID'),
        getBookPDF: $resource(pactl + '/scheck/getBookPDF'),
        addBookPDF: $resource(pactl + '/scheck/addbook'),
        removeBook: $resource(pactl + '/scheck/deletedBook'),
        operateList: $resource(pactl + '/scheck/waybills'),
        delList: $resource(pactl + '/scheck/delCheckByAWId'),
        // delList: $resource(pactl + '/scheck/delCheckByAWId/:id', {}, {
        //   remove: {
        //     method: 'DELETE'
        //   }
        // }),
        delReCheck: $resource(pactl + '/scheck/checkmsgcByAwId'),
        cancelStatus: $resource(pactl + '/scheck/delCheckStatus'),
        updateCheck: $resource(pactl + '/scheck/updateCheck'),
        queryDetail: $resource(pactl + '/scheck/waybill'),
        checkmsgc: $resource(pactl + '/scheck/checkmsgc'),
        queryCheckHistory: $resource(pactl + '/scheck/queryCheckHistory'),
        reCheckdetail: $resource(pactl + '/scheck/queryOperatHistorys'),
        queryUnitIsValid: $resource(pactl + '/scheck/queryUnitIsValid'),
      },
      // 原因
      reason: {
        queryList: $resource(pactl + '/scheck/getPScheckReasonsPage'),
        queryAll: $resource(pactl + '/scheck/getPScheckReasons'),
        addReason: $resource(pactl + '/scheck/addPScheckReasons'),
        updateReason: $resource(pactl + '/scheck/updatePScheckReasons'),
        removeReason: $resource(pactl + '/scheck/delPScheckReasons/:id', {}, {
          remove: {
            method: 'POST'
          }
        })
      },
      // 扣押库
      seizure: {
        queryAll: $resource(pactl + '/scheck/getSeizures'),
        queryAvailable: $resource(pactl + '/scheck/getUseSeizures'),
        addSeizure: $resource(pactl + '/scheck/addSeizure'),
        updateSeizure: $resource(pactl + '/scheck/updateSeizure')
      },
      // 危险品分类
      danger: {
        queryAll: $resource(pactl + '/scheck/getPDgoods'),
        addPDgoods: $resource(pactl + '/scheck/addPDgoods'),
        updatePDgoods: $resource(pactl + '/scheck/updatePDgoods')
      },
      // 24小时货通道
      aisle: {
        queryAll: $resource(pactl + '/scheck/getPAisles'),
        addPAisle: $resource(pactl + '/scheck/addPAisle'),
        updatePAisle: $resource(pactl + '/scheck/updatePAisle')
      },
      // 安检机
      machine: {
        queryList: $resource(pactl + '/scheck/getMachines'),
        queryAll: $resource(pactl + '/scheck/getMachineList'),
        addMachine: $resource(pactl + '/scheck/addMachine'),
        updateMachine: $resource(pactl + '/scheck/updateMachine'),
        delMachine: $resource(pactl + '/scheck/deleteMachineById/:id', {}, {
          remove: {
            method: 'POST'
          }
        })
      },
      // 安检设备
      equipment: {
        queryList: $resource(pactl + '/scheck/getEquipments'),
        addEquipment: $resource(pactl + '/scheck/addEquipment'),
        updateEquipment: $resource(pactl + '/scheck/updateEquipment'),
        delEquipment: $resource(pactl + '/scheck/deleteEquipmentById/:id', {}, {
          remove: {
            method: 'POST'
          }
        })
      },
      // 安检章类型
      stamp: {
        queryListPage: $resource(pactl + '/scheck/queryStampTypesPage'),
        queryList: $resource(pactl + '/scheck/queryStampTypes'),
        addStamp: $resource(pactl + '/scheck/addStampType'),
        updateStampType: $resource(pactl + '/scheck/updateStampType'),
        updateStamp: $resource(pactl + '/scheck/updateStamp'),
        delStampType: $resource(pactl + '/scheck/delStampType'),
        delStamp: $resource(pactl + '/scheck/delStamp'),
        addStamps: $resource(pactl + '/scheck/addStamp')
      },
      // 安检分队管理
      contingent: {
        queryList: $resource(pactl + '/scheck/queryUnits'),
        addContingent: $resource(pactl + '/scheck/addUnit'),
        updateContingent: $resource(pactl + '/scheck/updateUnit'),
        delContingent: $resource(pactl + '/scheck/delUnit'),
        queryById: $resource(pactl + '/scheck/queryUnit'),
        queryStamps: $resource(pactl + '/scheck/queryStamps'),
        updateStatus:  $resource(pactl + '/scheck/updateUnitStatus')
      },
      // 预审
      preJudice: {
        disConnect: $resource(pactl + '/apwb/subpushpno'),
        timeRemain: $resource(pactl + '/precheck/gettimestamp/:id'),
        timeRefresh: $resource(pactl + '/precheck/updatetimestamp'),
        querySingleCargo: $resource(pactl + '/precheck/queryByWaybillNO'),
        querySingleCargoById: $resource(pactl + '/precheck/queryBillByAwId'),
        queryCargo: $resource(pactl + '/precheck/querybill'),
        queryHistory: $resource(pactl + '/precheck/queryPactlHistory'),
        saveCargo: $resource(pactl + '/precheck/savestatus'),
        queryOperation: $resource(pactl + '/apwb/wbsynlist'),
        preOperation: $resource(pactl + '/apwb/wbinfo'),
        commitOperation: $resource(pactl + '/status/committopactl'),
        pass: $resource(pactl + '/precheck/passbill'),
        noPass: $resource(pactl + '/precheck/rejectbill'),
        opTimeOut: $resource(pactl + '/precheck/gobackstatus/:id'),
        ediAirline: $resource(pactl + '/apwb/mairline'),
        saveName: $resource(pactl + '/apwb/smgoodsexp'),
        editSalesA: $resource(pactl + '/wb/applychangeagent2'),
        editOpaA: $resource(pactl + '/wb/applychangeagent'),
        pullToA: $resource(pactl + '/apwb/subpush'),
        secsubpush: $resource(pactl + '/apwb/secsubpush'),
        pullDownA: $resource(pactl + '/apwb/subpull'),
        agenQname: $resource(pactl + '/apwb/gaqlist'),
        waybillQuote: $resource(pactl + '/apwb/mgoodsquote'),
        bookCheck: $resource(pactl + '/precheck/queryBooksDetail'),
        saveBookCheck: $resource(pactl + '/precheck/savebookstatus'),
        moveToLocal: $resource(pactl + '/precheck/moveToLocal'),
        checkStatus: $resource(pactl + '/precheck/checkBookPassOrNot'),
        addbooks: $resource(pactl + '/waybillbooks/addbooks'),
        addOtherbooks: $resource(pactl + '/waybillbooks/addother'),
        removeBooks: $resource(pactl + '/waybillbooks/delete'),
        queryAllBooks: $resource(pactl + '/waybillbooks/onetimebooks'),
        reback: $resource(pactl + '/status/backfrompactl'),
        unpack: $resource(pactl + '/status/ckopenflag'),
        unpackPass: $resource(pactl + '/status/openflag'),
        rebooks: $resource(pactl + '/status/rebooks'),
        checkRebook: $resource(pactl + '/status/statusdetail'),
        seaRebooks: $resource(pactl + '/waybillbooks/onetimebooks'),
        focus: $resource(pactl + '/apwb/waybillfocus'),
        queryBookType: $resource(pactl + '/apwb/querybooks'),
        queryCheck: $resource(pactl + '/precheck/querylocalbill'),
        queryRecord: $resource(pactl + '/precheck/queryLocalRecord'),
        queryList: $resource(pactl + '/precheck/localQueryList'),
        moveToCommon: $resource(pactl + '/precheck/moveToCommon'),
        queryCommon: $resource(pactl + '/precheck/localQueryDgr'),
        saveCommon: $resource(pactl + '/precheck/localCheck'),
        checkName: $resource(pactl + '/precheck/localRecheckDetail'),
        saveRechec: $resource(pactl + '/precheck/localRecheck'),
        checkPass: $resource(pactl + '/precheck/localPassBill'),
        checkNoPass: $resource(pactl + '/precheck/localRejectBill'),
        checkBook: $resource(pactl + '/precheck/checkBook'),
        editData: $resource(pactl + '/apwb/updatewaybill'),
        ckElectricFlag: $resource(pactl + '/apwb/ckElectricFlag'),
        lockStatus: $resource(pactl + '/status/update/lockStatus'),
        dbPre: $resource(pactl + '/precheck//pre/again')
      },
      dataEdit: {
    	getLastTime: $resource(pactl+'/comm/get/login/date'),
        queryList: $resource(pactl + '/version/listdifference'),
        differencesCount: $resource(pactl + '/version/listdifference/count'),
        getVersion: $resource(pactl + '/version/getversion'),
        getFirstCheck: $resource(pactl + '/version/firstcheck'),
        getKeyField: $resource(pactl + '/version/fieldset'),
        getEditData: $resource(pactl + '/version/beforedifferences'),
        getStatus: $resource(pactl + '/version/status'),
        saveData: $resource(pactl + '/version/update/withoutkeywords'),
        saveKeyData: $resource(pactl + '/version/update/withkeywords'),
        saveDirectData: $resource(pactl + '/version/update/directly'),
        booksCount: $resource(pactl + '/waybillbooks/bookscount'),
        agentCommit: $resource(pactl + '/version/agent/commit'),
        agentCancel: $resource(pactl + '/version/agent/back'),
        getAuditData: $resource(pactl + '/version/afterdifferences'),
        getDoneData: $resource(pactl + '/version/differences/byversion'),
        pactlSave: $resource(pactl + '/version/pactl/save'),
        pactlAudit: $resource(pactl + '/version/pactl/commit'),
        cancelChange: $resource(pactl + '/version/update/delete'),
        rebook: $resource(pactl + '/status/change/rebook')

      },
      // 备注
      remark: {
        // pactl 预审备注
        queryPactlRemark: $resource(pactl + '/comments/querypactltrial'),
        addPactlRemark: $resource(pactl + '/comments/pactltrial'),
        // agent 预审备注
        queryAgentRemark: $resource(pactl + '/comments/queryagenttrial'),
        addAgentRemark: $resource(pactl + '/comments/agenttrial'),
        // 收单 备注
        queryReceiveRemark: $resource(pactl + '/comments/queryreceiving'),
        addReceiveRemark: $resource(pactl + '/comments/receiving'),
        removeRemark: $resource(pactl + '/comments/delete')
      },
      // 历史记录
      history: {
        opHistory: $resource(pactl + '/comm/his/detail'),
        auditHistory: $resource(pactl + '/comm/check/detail')
      },
      // 收单
      waybill: {
        statusdetail: $resource(pactl + '/status/statusdetail'),
        billdetail: $resource(pactl + '/receivewaybill/billdetail'),
        billdetailbyid: $resource(pactl + '/receivewaybill/billdetailbyid'),
        checklist: $resource(pactl + '/receivewaybill/receivingbilldetail'),
        saveChecklist: $resource(pactl + '/receivewaybill/savedetail'),
        passChecklist: $resource(pactl + '/receivewaybill/action'),
        progressChecklist: $resource(pactl + '/comm/status/detail'),
        localcheckList: $resource(pactl + '/status/localecheck'),
        returncount: $resource(pactl + '/receivewaybill/returncount'),
        returnbill: $resource(pactl + '/status/returnbill'), //退单  
        sendinitdata: $resource(pactl + '/status/sendinitdata'), //发送核放行数据
        printbill: $resource(pactl + '/receivewaybill/printbill'), //打退库单
        cancelprintbill: $resource(pactl + '/receivewaybill/cancelprintbill'), //取消打印退库单
        eleWaybill: $resource(pactl + '/other/ornotelewaybill'), //改为非电子运单
        queryMove: $resource(pactl + '/other/queryempty'), //空侧迁转查询
        editMove: $resource(pactl + '/other/updateempty'), //空侧迁转编辑
        queryChHistory: $resource(pactl + '/other/queryOldallocation'), //历史运单改配查询
        queryChange: $resource(pactl + '/other/queryallocation'), //运单改配查询
        saveChange: $resource(pactl + '/other/insertallocation'), //运单确认改配
        historyRecords: $resource(pactl + '/other/historyfile'), //历史文档
        historyRecordsFWB: $resource(pactl + '/msg/getMsg'), //历史文档FWB
        remarkInvalid: $resource(pactl + '/other/status'), //空标记为无效运单
        restorage: $resource(pactl + '/other/restorage'), //重新入库
        approachflag: $resource(pactl + '/receivewaybill/delete/approachflag'), //标记为未进场
        deletechanged: $resource(pactl + '/other/deletechanged'), //删除运单改配
        changedDetail: $resource(pactl + '/other/changed/detail'), //查询运单改配
        cancelRestorage: $resource(pactl + '/other/cancel/restorage'), //取消重新入库接口
        addSe: $resource(pactl + '/status/device/book'),
        remarkFormal: $resource(pactl + '/status/update/formal/flag'), //空标记为无效运单
      },
      localecheck: {
        pactlAddLocalcheck: $resource(pactl + '/status/addlocalcheck'),
        queryList: $resource(pactl + '/localecheck/checklist')
      },
      // 声明
      declare: {
        cargoDeclare: $resource(pactl + '/cargodeclare/waybilldetail'),
        add: $resource(pactl + '/cargodeclare/addorupdate'),
        battaryDeclare: $resource(pactl + '/li/query'),
        addBattary: $resource(pactl + '/li/addorupdate')
      },
      // 消息模板
      msgTemp: {
        queryList: $resource(pactl + '/msg/template/querylist'),
        add: $resource(pactl + '/msg/template/iou'),
        remove: $resource(pactl + '/msg/template/delete'),
        getMsg: $resource(pactl + '/message/querylist/notread'),
        getMsgList: $resource(pactl + '/message/querylist'),
        readMsg: $resource(pactl + '/message/has/read'),
        delMsg: $resource(pactl + '/message/delete'),
        delAllMsg: $resource(pactl + '/message/delete/all')
      },
      //安全 pactl-platform-framework/api/pactl/email/manage/querylist
      secure:{
    	  queryList : $resource(pactl + '/access/query'),
    	  ipUpdate:$resource(pactl+'/access/updateOrInsert'),//编辑
    	  ipDel:$resource(pactl+'/access/changeStatus')//有效无效 删除
      },
      // 收发货人
      people: {
        savePeople: $resource(pactl + '/shipper/addorupdate'),
        peopleList: $resource(pactl + '/shipper/querylist'),
        delPeople: $resource(pactl + '/shipper/delete'),
        exportExl: pactl + '/shipper/expquerylist'
      },
      // agent 品名管理
      nameAdviceManege: {
        nameAdviceList: $resource(pactl + '/gd/getgds'),
        addNameAdvice: $resource(pactl + '/gd/smgd'),
        batchNameAdvice: $resource(pactl + '/gd/smgds'),
        delNameAdvice: $resource(pactl + '/gd/delgd'),
        batchDelNameAdvice: $resource(pactl + '/gd/delgds')
      },
      // 报文地址授权
      address: {
        addressList: $resource(pactl + '/msg/addr/querylist'),
        editAddress: $resource(pactl + '/msg/addr/iou'),
        delAddress: $resource(pactl + '/msg/addr/change/status'),
        queryAddress: $resource(pactl + '/msg/addr/query'),
        editEwayAddress: $resource(pactl + '/msg/addr/isEWaybill')
      },
      // 收单标签
      receiveTag: {
        queryList: $resource(pactl + '/receivingmark/query'),
        addTag: $resource(pactl + '/receivingmark/addorupdate'),
        removeTag: $resource(pactl + '/receivingmark/delete')
      },
      // pactl---功能--报文--
      message: {
        queryList: $resource(pactl + '/msg/sitacount'),
        exportToexcel: pactl + '/msg/expquerylist',
        testMessage: $resource(pactl + '/msg/trans'),
        sendFWB: $resource(pactl + '/msg/transtofwb')
      },
      // 品名大数据
      goods: {
        nameList: $resource(pactl + '/goods/name/querylist'),
        saveName: $resource(pactl + '/goods/name/iou'),
        delName: $resource(pactl + '/goods/name/delete')
      },
      // 邮件
      mail: {
        editMail: $resource(pactl + '/mail/addr/iou'),
        queryMail: $resource(pactl + '/mail/addr/querylist'),
        changeStatus: $resource(pactl + '/mail/addr/change/status')
      },
      // 货站审单任务分配规则设置
      taskRule: {
        ruleList: $resource(pactl + '/check/rule/querylist'),
        editRule: $resource(pactl + '/check/rule/iou'),
        delRule: $resource(pactl + '/check/rule/deleteone')
      },
      // 收单补交文件
      receiveFile: {
        fileList: $resource(pactl + '/collectbill/file/querylist'),
        editFile: $resource(pactl + '/collectbill/file/iou'),
        delFile: $resource(pactl + '/collectbill/file/change/status')
      },
      // 代理预审文件
      preJudiceFile: {
        fileList: $resource(pactl + '/reagencyfile/queryByCondition'),
        editFile: $resource(pactl + '/reagencyfile/addOrUpdate'),
        delFile: $resource(pactl + '/reagencyfile/change/status')
      },
      // 货站管理
      cargoStation: {
        cargoStationList: $resource(pactl + '/scheck/getCargos'),
        queryAll: $resource(pactl + '/scheck/getCargoList'),
        getAllCargos: $resource(pactl + '/scheck/getAllCargos'),
        addCargoStation: $resource(pactl + '/scheck/addCargo'),
        editCargoStation: $resource(pactl + '/scheck/updateCargo'),
        delCargoStation: $resource(pactl + '/scheck/deleteCargosById/:id', {}, {
          remove: {
            method: 'POST'
          }
        })
      },
      // 特货代码
      specialcargo: {
        specialcargoList: $resource(pactl + '/specialcargo/query'),
        addSpecialcargo: $resource(pactl + '/specialcargo/addorupdate'),
        ableSpecialcargo: $resource(pactl + '/specialcargo/changeuseful'),
        delSpecialcargo: $resource(pactl + '/specialcargo/delete'),
        checklist: $resource(pactl + '/localecheck/checklist')
      },
      // 货币
      currency: {
        queryList: $resource(pactl + '/currency/querylist'),
        queryAll: $resource(pactl + '/currency/queryall'),
        addCurrency: $resource(pactl + '/currency/iou'),
        removeCurrency: $resource(pactl + '/currency/change/status')
      },
      // 字典
      dictionary: {
        queryList: $resource(pactl + '/comm/dict/list'),
        addDict: $resource(pactl + '/comm/dict/add'),
        removeDict: $resource(pactl + '/comm/dict/del')
      },
      // 字典分类
      dictionaryType: {
        queryList: $resource(pactl + '/comm/dict/typelist'),
        addType: $resource(pactl + '/comm/dict/addtype'),
        removeType: $resource(pactl + '/comm/dict/deltype')
      },
      // 字段分类
      fieldType: {
        fieldList: $resource(pactl + '/field/sort/querylist'),
        queryAll: $resource(pactl + '/field/sort/queryall'),
        addField: $resource(pactl + '/field/sort/iou'),
        delField: $resource(pactl + '/field/sort/delete')
      },
      // 字段维护
      field: {
        fieldList: $resource(pactl + '/field/maintain/querylist'),
        queryAll: $resource(pactl + '/field/maintain/queryall'),
        addField: $resource(pactl + '/field/maintain/iou'),
        delField: $resource(pactl + '/field/maintain/delete'),
        queryField: $resource(pactl + '/queryDB/queryfields')
      },
      // 运单校验分类
      verifyType: {
        queryList: $resource(pactl + '/check/sort/querylist'),
        queryAll: $resource(pactl + '/check/sort/queryall'),
        addType: $resource(pactl + '/check/sort/iou')
      },
      // 航空公司必录项
      fieldAirline: {
        fieldList: $resource(pactl + '/airline/required/querylist'),
        addField: $resource(pactl + '/airline/required/iou'),
        delField: $resource(pactl + '/airline/required/delete')
      },
      // pactl预审必录项
      fieldPactl: {
        fieldList: $resource(pactl + '/pretrial/required/querylist'),
        addField: $resource(pactl + '/pretrial/required/insert'),
        delField: $resource(pactl + '/pretrial/required/delete')
      },
      // 运单关键字段列表
      fieldBill: {
        fieldList: $resource(pactl + '/keyfield/list/querylist'),
        addField: $resource(pactl + '/keyfield/list/insert'),
        delField: $resource(pactl + '/keyfield/list/delete')
      },
      // 报文基础设置
      msgBase: {
        queryList: $resource(pactl + '/msg/base/querylist'),
        queryAll: $resource(pactl + '/msg/base/queryall'),
        addMsg: $resource(pactl + '/msg/base/iou'),
        delMsg: $resource(pactl + '/msg/base/delete'),
        queryCatalogList: $resource(pactl + '/rec/send/catalog/querylist'),
        queryCatalogAll: $resource(pactl + '/rec/send/catalog/queryall'),
        editCatalog: $resource(pactl + '/rec/send/catalog/iou'),
        delCatalog: $resource(pactl + '/rec/send/catalog/delete')
      },
      msgSend: {
        queryList: $resource(pactl + '/send/set/querylist'),
        addMsg: $resource(pactl + '/send/set/iou'),
        delMsg: $resource(pactl + '/send/set/delete')
      },
      msgReceive: {
        queryList: $resource(pactl + '/msg/rec/querylist'),
        addMsg: $resource(pactl + '/msg/rec/iou'),
        delMsg: $resource(pactl + '/msg/rec/delete')
      },
      barCode: {
        barCode: $resource(pactl + '/comm/barCode')
      },
      airline: {
        statistics: $resource(pactl + '/report/airline/statistics'),
        approachQueue: $resource(pactl + '/report/airline/approach/queue'),
        waybill: $resource(pactl + '/report/airline/waybill'),
        queryAll: $resource(pactl + '/airline/wb/getAll'),
        queryByNo: $resource(pactl + '/airline/wb/waybillInfo'),
        queryFlightNo: $resource(pactl + '/airline/wb/get/flightNo')

      },
      /********************************系统管理************************************/
      // 头像
      avartar: {
        url: org + '/users/avatars/ ',
        unitUrl: org + '/units/avatars/ ',
        securityurl: org + '/users/security/avatars/ '
      },
      // 用户
      user: {
        users: $resource(org + '/users/ '),
        addusers: $resource(pactlorg + '/users/ '),
        addAgentUsers: $resource(pactlorg + '/users/agent '),
        pageUsers: $resource(pactlorg + '/users/page'),
        listUsersByUnit: $resource(pactlorg + '/users/listUsersByOpUnit/:opId'),
        updatePassword: $resource(pactlorg + '/users/password/:id'),
        updateSuperPassword: $resource(pactlorg + '/users/superadmin/update/password'),
        changePassword: $resource(pactlorg + '/users/pwd/:id'),
        checkaccount: $resource(pactlorg + '/users/account/:account'),
        addUserRole: $resource(pactlorg + '/users/addUserRole'),
        historys: $resource(pactlorg + '/users/history'),
        editUser: $resource(pactlorg + '/users/:id', {}, {
          put: {
            method: 'PUT'
          }
        }),
        ableUser: $resource(pactlorg + '/users/:id/:type', {}, {
          put: {
            method: 'PUT'
          }
        }),
        delUser: $resource(pactlorg + '/users/rm/:id', {}, {
          remove: {
            method: 'POST'
          }
        })
      },
      // 用户组
      userGroup: {
        usergroups: $resource(org + '/usergroups/ '),
        pageUserGroups: $resource(org + '/usergroups/page'),
        editUserGroups: $resource(org + '/usergroups/:id', {}, {
          put: {
            method: 'PUT'
          }
        }),
        delUserGroups: $resource(org + '/usergroups/:id', {}, {
          remove: {
            method: 'DELETE'
          }
        })
      },
      // 角色
      role: {
        roles: $resource(org + '/roles/ '),
        opagentRoles: $resource(pactlorg + '/roles/listAvailableRolesOfOpAgent/:id '),
        opagentRolesByType: $resource(pactlorg + '/roles/listAvailableRolesOfOpAgent/:id/:type '),
        allOpagentRoles: $resource(pactlorg + '/roles/listAllRolesOfOpAgent/:id '),
        allUnitRolesOfAgent: $resource(pactlorg + '/roles/listAllUnitRolesOfAgent/:id '),
        addRoles: $resource(org + '/roles/addRoleSet'),
        pageRoles: $resource(org + '/roles/page'),
        editRole: $resource(org + '/roles/:id', {}, {
          put: {
            method: 'PUT'
          },
          remove: {
            method: 'DELETE'
          }
        }),
        delRolePermission: $resource(org + '/roles/revokePermissionSchemesFromRole'),
        grantPermissionSetsToRole: $resource(org + '/roles/grantPermissionSetsToRole')
      },
      grantRole: {
        roles: $resource(pactlorg + '/grants/roles '),
        grantRoles: $resource(pactlorg + '/grants/ '),
        addGrantRoles: $resource(pactlorg + '/grants/ '),
        pageGrantRoles: $resource(pactlorg + '/grants/page'),
        editGrantRole: $resource(pactlorg + '/grants/rm/:id', {}, {
          put: {
            method: 'PUT'
          },
          remove: {
            method: 'POST'
          }
        })
      },
      // 机构
      unit: {
        units: $resource(pactlorg + '/units/ '),
        pageUnits: $resource(org + '/units/page'),
        editUnit: $resource(org + '/units/:id', {}, {
          put: {
            method: 'PUT'
          },
          remove: {
            method: 'DELETE'
          }
        }),
        editEname: $resource(pactlorg + '/addenam/:id', {}, {
          put: {
            method: 'PUT'
          },
          remove: {
            method: 'DELETE'
          }
        }),
        addEname: $resource(pactlorg + '/addenam/ '),
        listEname: $resource(pactlorg + '/addenam/unit/:unitId'),
      },
      // 权限
      permisson: {
        permissionsets: $resource(org + '/permissionsets/ '),
        pagePermissionsets: $resource(org + '/permissionsets/page'),
        editPermissionset: $resource(org + '/permissionsets/:id', {}, {
          put: {
            method: 'PUT'
          },
          remove: {
            method: 'DELETE'
          }
        })
      },
      // 权限方案
      permissionscheme: {
        permissionschemes: $resource(org + '/permissionschemes/ '),
        permissionschemesbytype: $resource(org + '/permissionschemes/plantype'),
        pagePermissionschemes: $resource(org + '/permissionschemes/page'),
        editPermissionscheme: $resource(org + '/permissionschemes/:id', {}, {
          put: {
            method: 'PUT'
          },
          remove: {
            method: 'DELETE'
          }
        }),
        grantRoleToPermissionSchemes: $resource(org + '/permissionschemes/grantRoleToPermissionSchemes'),
        rolePermissionSchemes: $resource(org + '/permissionschemes/:id/rolePermissionSchemes'),
        additems: $resource(org + '/permissionschemes/:id/additems')
      },
      // 权限集合
      permissionset: {
        permissionsets: $resource(org + '/permissionsets/ '),
        pagePermissionsets: $resource(org + '/permissionsets/page'),
        addPermissionsetItems: $resource(pactlorg + '/permissionschemes/permission/:id'),
        editPermissionsetItem: $resource(pactlorg + '/permissionschemes/permission/:id', {}, {
          put: {
            method: 'PUT'
          },
          remove: {
            method: 'DELETE'
          }
        }),
        editPermissionsets: $resource(org + '/permissionsets/:id', {}, {
          put: {
            method: 'PUT'
          },
          remove: {
            method: 'DELETE'
          }
        })
      },
      //机构用户角色
      unitroleactor: {
        actors: $resource(org + '/unitroleactors/actors/ '),
        addActor: $resource(org + '/unitroleactors/units/:unitId/roles/:roleId'),
        pageActors: $resource(org + '/unitroleactors/page'),
        roles: $resource(pactlorg + '/agentrelation/canGantRolesByOp/:id'),
        saleroles: $resource(pactlorg + '/agentrelation/canGantRolesByOp/:id/sale/:saleunitid'),
        editActor: $resource(org + '/unitroleactors/units/actors/:id', {}, {
          put: {
            method: 'PUT'
          },
          remove: {
            method: 'DELETE'
          }
        })
      },
      //pactl-管理操作代理
      operAgent: {
        operagents: $resource(pactlorg + '/units/actors/ '),
        addoperagents: $resource(pactlorg + '/units/ '),
        agentDetail: $resource(pactlorg + '/units/unit/:id'),
        pageoperagents: $resource(pactlorg + '/units/page'),
        listoperagents: $resource(pactlorg + '/units/condition'),
        disabledUnit: $resource(org + '/units/valid/:id'),
        editoperagents: $resource(pactlorg + '/units/:id', {}, {
          put: {
            method: 'PUT'
          },
          remove: {
            method: 'DELETE'
          }
        })
      },
      //销售代理关联操作代理
      saleAgent: {
        queryOperAgents: $resource(pactlorg + '/agentrelation/page '),
        applyoperagents: $resource(pactlorg + '/agentrelation/newOrReApplyOpAgent/:id'),
        operatorlinkagents: $resource(pactlorg + '/agentrelation/operator/:id'),
        queryUserIsManager: $resource(pactlorg + '/agentrelation/isManager/:deptId/:userid ')
      },
      //操作代理管理销售代理
      operatorAgentManage: {
        querySaleAgents: $resource(pactlorg + '/agentrelation/sale/page '),
        queryInvitationCode: $resource(pactlorg + '/agentrelation/invotationcode/:id'),
        updateInvitationCode: $resource(pactlorg + '/agentrelation/invotationcode/update'),
        updateSaleUnit: $resource(pactlorg + '/units/:id/:unit', {}, {
          put: {
            method: 'PUT'
          }
        }),
        refuseApply: $resource(pactlorg + '/agentrelation/refuseApply/:id'),
        agreeApply: $resource(pactlorg + '/agentrelation/agreeApply/:id'),
        manage: $resource(pactlorg + '/agentrelation/updateAgentStatus/:id')
      },
      //操作/销售代理用户管理
      agentuserManage: {
        queryunits: $resource(pactlorg + '/agentrelation/units/:id'),
        queryAgentUsers: $resource(pactlorg + '/agentrelation/page/user/:id/:unitid'),
        addManager: $resource(pactlorg + '/agentrelation/addManager'),
        queryroles: $resource(org + '/roles/unit/:id'),
        manage: $resource(pactlorg + '/agentrelation/updateAgentStatus/:id')
      },
      // org 数据
      ddic: {
        pcode: $resource(ddic + '/dictionarys/pcode')
      },
      //系统设置
      systemSet: {
        queryList: $resource(pactl + '/system/set/query'),
        updateList: $resource(pactl + '/system/set/update'),
        querySingleSet: $resource(pactl + '/comm/item'),
        pageOption: $resource(pactl + '/comm/pageOption'),
        queryHistory: $resource(pactl + '/log/query'),
      },
      //系统设置
      systemEmail: {
        queryAllEmails: $resource(mail + '/account/listAllMailAccounts'),
        queryAllEmailsByPage: $resource(mail + '/account/listAllMailAccountsByPage/:pagenum/:pagesize'),
        addAllEmails: $resource(mail + '/account/ '),
        editAllEmails: $resource(mail + '/account/:accountId', {}, {
          put: {
            method: 'PUT'
          }
        }),
        delAllEmails: $resource(mail + '/account/deleteMailAccount/:accountId', {}, {
          remove: {
            method: 'DELETE'
          }
        }),
        queryList: $resource(pactl + '/email/manage/querylist'),
        updateList: $resource(pactl + '/email/manage/iou'),
        delList: $resource(pactl + '/email/manage/delete'),
        test: $resource(pactl + '/mail/check')
      },
      // 系统设置 ----预审邮件提醒
      PreNoticeEmail: {
        queryPreNoticeEmail: $resource(pactl + '/PreMailReminder/querylist'),
        updatePreNoticeEmail: $resource(pactl + '/PreMailReminder/iou'),
        delPreNoticeEmail: $resource(pactl + '/PreMailReminder/delete'),
        testPreNoticeEmail: $resource(pactl + '/PreMailReminder/testSendMail'),
        findNoReTime: $resource(pactl + '/PreMailReminder/findNoReTime')
      },
      // 系统设置 ----正式运单规则
      officialRule: {
        queryList: $resource(pactl + '/rule/query'),
        updateList: $resource(pactl + '/rule/iou'),
        delList: $resource(pactl + '/rule/delete')
      },
      // 系统设置 ----界面显示
      UIdisplay: {
        queryAll: $resource(pactl + '/agent/index/query'),
        updateDisplay: $resource(pactl + '/agent/index/update'),
        beSubmitted: $resource(pactl + '/scheck/toBeSubmitted')
      },
      //安检用户管理
      securityuser: {
        secunits: $resource(org + '/units/type '),
        seccheckunits: $resource(pactl + '/security/units'),
        pageSecUsers: $resource(pactlorg + '/security/page'),
        editRole: $resource(org + '/roles/:id', {}, {
          put: {
            method: 'PUT'
          },
          remove: {
            method: 'DELETE'
          }
        })
      },
      // 系统设置 ---- 用户管理----微信用户管理
      wechat: {
        queryList: $resource(wechat + '/wechat/bind/search'),
        bound: $resource(wechat + '/wechat/bind/check/:id'),
        unbound: $resource(wechat + '/wechat/bind/unbind/:id'),
        delwechat: $resource(wechat + '/wechat/bind/delete/:id'),
        usersByOpUnit: $resource(wechat + '/wechat/bind/listUsersByOpUnit/:opid')
      },
      // 获取相关菜单
      menu: {
        getMenu: $resource(pactlorg + '/tokens/getMenus/:tokens/:unitid')
      },
      // 获取相关报表
      report: {
        getList: $resource(pactlorg + '/tokens/getAllReports/:tokens/:unitid')
      },
      // 获取权限相关
      permission: {
        getPermission: $resource(pactlorg + '/tokens/getPermission/:tokens/:unitid/:resId')
      },
      //机构资源管理
      resmanage: {
        pageRes: $resource(pactlorg + '/res/page'),
        queryAll: $resource(pactlorg + '/res/queryAll'),
        addRes: $resource(pactlorg + '/res/ '),
        editRes: $resource(pactlorg + '/res/:id', {}, {
          put: {
            method: 'PUT'
          },
          remove: {
            method: 'DELETE'
          }
        })
      }
    };
  }
];