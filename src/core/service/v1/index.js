const service = {
  signup: "users/register",
  emailotpverify: "users/emailotpverify",
  resendCode: "users/resendCode",
  signin: "users/login",
  logout: "users/logout",
  verifyToken: "adminapi/verifyToken",
  adminlogin: "adminapi/login",
  adminlogg: "adminapi/adminlogg",
  verify_otp: "adminapi/verify_otp",

  dashboardcounts: "adminapi/dashboard-counts",
  changeUserAccountStatus: "adminapi/changeUserAccountStatus",
  changeVipBadgeStatus: "adminapi/changeVipBadgeStatus",
  kycAprove: "adminapi/kycAprove",
  kycReject: "adminapi/kycReject",
  p2pchat: "adminapi/p2p_chat",
  updatedispute: "p2p/update_dispute_statusbyadmin",

  getKyclist: "adminapi/getKyclist",

  rewardManagement: "adminapi/reward-settings",
  referralrewardManagement: "adminapi/referral-reward-settings",
  getRewardManagement: "adminapi/get-reward",

  airdropManagement: "adminapi/airdrop-settings",
  getAirdropManagement: "adminapi/get-airdrop",

  activatedUserList: "adminapi/activatedUserList",

  tradepair_view: "adminapi/tradepair/view",
  changetradeStatus: "adminapi/tradepair/changestatus",
  changeliqudityStatus: "adminapi/tradepair/changeliqstatus",
  tradecurrency: "adminapi/tradepair/currency",
  getTradepairOne: "adminapi/tradepair/getTradepairOne",
  addTradePair: "adminapi/tradepair/addTradePair",
  deletetradepair: "adminapi/tradepair/deletetradepair",

  getAdminTfaDetials: "adminapi/getQRcode",
  adminChangeTfaStatus: "adminapi/changeTfaStatus",
  adminChangePassword: "adminapi/changePassword",

  userbalance: "adminapi/userbalance",
  useraddress: "adminapi/useraddress",
  get_all_user_deposit: "withdraw/get_all_user_deposit",
  get_all_user_withdraw: "withdraw/get_all_user_withdraw",
  admin_withdraw_approve: "withdraw/admin_withdraw_approve",

  changeEmail: "adminapi/changeEmail",
  Addbalance: "adminapi/Addbalance",

  cms_update: "adminapi/cms_update",
  allCurrencyListCrypto: "adminapi/allCurrencyListCrypto",
  viewOneCurrency: "adminapi/viewOneCurrency",
  getStaking: "adminapi/getStaking",

  getprofit: "adminapi/getprofit",
  cms_list: "adminapi/cms_list",
  currencyAddUpdate: "adminapi/currencyAddUpdate",
  updateStakingFlexible: "adminapi/updateStakingFlexible",

  deletecurrency: "adminapi/deletecurrency",

  cms_get: "adminapi/cms_get",
  mailtemplate_list: "adminapi/mailtemplate_list",
  mailtemplate_update: "adminapi/mailtemplate_update",
  mailtemplate_get: "adminapi/mailtemplate_get",
  deletetemplate: "adminapi/deletetemplate",
  deletecmsdetail: "adminapi/deletecmsdetail",
  getAdminProfile: "adminapi/admindetails",
  get_sitedata: "adminapi/get_sitedata",
  update_settings: "adminapi/update_settings",
  updateProfile: "adminapi/updateProfile",
  updateTfa: "adminapi/updateTfa",
  checkPassword: "adminapi/check_password",

  sitesetting: "adminapi/addsitesettings",
  getSitedata: "adminapi/getsitesettings",

  support_category_list: "adminapi/support_category_list",
  support_category_get: "adminapi/support_category_get",
  support_category_update: "adminapi/support_category_update",
  support_category_delete: "adminapi/support_category_delete",
  support_save: "adminapi/support_save",
  support_list: "adminapi/support_list",
  support_view: "adminapi/support_view",

  forgotemailotp: "adminapi/forgotemailotp",
  forgototpverify: "adminapi/forgototpverify",
  resetpassword: "adminapi/forgotpassword",
  resendemailotp: "adminapi/resendemailotp",

  getActiveOrders: "adminapi/getActiveOrders",
  getOrdersHistory: "adminapi/getTradeHistory",
  getCancelOrdersHistory: "adminapi/getCancelOrders",
  get_all_user_swap: "adminapi/get_all_user_swap",
  getProfit: "adminapi/getprofit",
  getinternalTransfer: "adminapi/getTransferHistory",
  getP2Porders: "adminapi/getP2POrdersHistory",
  getP2PconfirmOrders: "adminapi/getP2PConfirmOrdersHistory",
  getP2Pdispute: "adminapi/getP2PDisputeHistory",
  getdisputedetail: "adminapi/getDisputeDetail",
  changeActivedispute: "adminapi/changeActivedispute",
  changefreezedispute: "adminapi/changefreezedispute",
  getadminProfitDetails: "adminapi/getProfitDetails",
  downloadProfits: "adminapi/downloadProfits",

  getdisputechat: "adminapi/get_dispute_chat",

  //wallet
  wallet_login: "adminapi/wallet_login",
  walletCurrenList: "adminapi/fund_wallet_list",
  generateAdminaddress: "address/generateAdminAddress",
  transaction: "adminapi/get_deposit_list",
  fieldValidate: "withdraw/fieldvalidateAdmin",
  withdrawProcess: "withdraw/processAdmin",
  getBalanceBlock: "adminapi/getBalance",
  getWalletTransaction: "adminapi/adminwallet_transactions",
  cancel_p2pOrder: "adminapi/cancel_confirm_order",
  payment_method_list: "adminapi/payment_method_list",
  payment_method_get: "adminapi/payment_method_get",
  payment_method_update: "adminapi/payment_method_update",
  payment_method_delete: "adminapi/payment_method_delete",
  confirm_p2pOrder: "adminapi/release_coin",

  //vip
  getVipDatas: "adminapi/getVipDatas",
  saveVipDatas: "adminapi/saveVipDatas",
  getUSDTtoPTK: "adminapi/getUSDTtoPTK",
};

export default service;
