const proxyName = "代理模式";

function main(params) {
	if (!params.proxies) return params;
	overwriteRules(params);
	overwriteProxyGroups(params);
	overwriteDns(params);
	return params;
}

const countryRegions = [
	{ code: "HK", name: "香港", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/hk.svg", regex: /(香港|HK|Hong|🇭🇰)(?!.*(中国|CN|China|PRC|🇨🇳))/i },
	{ code: "TW", name: "台湾", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/tw.svg", regex: /(台湾|TW|Taiwan|🇹🇼)(?!.*(中国|CN|China|PRC|🇨🇳))(?!.*Networks)/i },
	{ code: "HK|SG", name: "香港", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/hk.svg", regex: /(香港|HK|Hong|🇭🇰|新加坡|狮城|SG|Singapore|🇸🇬)(?!.*(中国|CN|China|PRC|🇨🇳))/i },
	{ code: "SG", name: "新加坡", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/sg.svg", regex: /(新加坡|狮城|SG|Singapore|🇸🇬)/i },
	{ code: "JP", name: "日本", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/jp.svg", regex: /(日本|JP|Japan|东京|🇯🇵)/i },
	{ code: "US", name: "美国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/us.svg", regex: /^(?!.*(Plus|plus|custom)).*(美国|洛杉矶|US|USA|United States|America|🇺🇸)/i },
	{ code: "DE", name: "德国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/de.svg", regex: /^(?!.*shadowsocks).*(德国|DE|Germany|🇩🇪)/i },
	{ code: "KR", name: "韩国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/kr.svg", regex: /(韩国|首尔|KR|Korea|South Korea|🇰🇷)/i },
	{ code: "UK", name: "英国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/gb.svg", regex: /(英国|UK|United Kingdom|Britain|Great Britain|🇬🇧)/i },
	{ code: "CA", name: "加拿大", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ca.svg", regex: /^(?!.*(Anycast|Datacamp)).*(加拿大|CA|Canada|🇨🇦)/i },
	{ code: "AU", name: "澳大利亚", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/au.svg", regex: /(澳大利亚|AU|Australia|🇦🇺)/i },
	{ code: "FR", name: "法国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/fr.svg", regex: /^(?!.*(free|Frontier|Frankfurt)).*(法国|FR|France|🇫🇷)/i },
	{ code: "NL", name: "荷兰", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/nl.svg", regex: /^(?!.*(only|online|MNL)).*(荷兰|NL|Netherlands|🇳🇱)/i },
	{ code: "RU", name: "俄罗斯", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ru.svg", regex: /(俄罗斯|RU|Russia|🇷🇺)/i },
	{ code: "IN", name: "印度", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/in.svg", regex: /^(?!.*(Singapore|Argentina|Intel|Inc|ing|link|business|hinet|internet|印度尼西亚|main)).*(印度|IN|India|🇮🇳)/i }, 
	{ code: "BR", name: "巴西", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/br.svg", regex: /(巴西|BR|Brazil|🇧🇷)/i },
	{ code: "IT", name: "意大利", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/it.svg", regex: /^(?!.*(mitce|reality|digital|leiting|limited|it7|territories)).*(意大利|IT|Italy|🇮🇹)/i },
	{ code: "CH", name: "瑞士", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ch.svg", regex: /^(?!.*(incheon|chunghwa|tech|psychz|channel|seychelles|chuncheon)).*(瑞士|CH|Switzerland|🇨🇭)/i },
	{ code: "SE", name: "瑞典", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/se.svg", regex: /^(?!.*(sel2|sea1|server|selfhost|neonpulse|base|seoul|seychelles)).*(瑞典|SE|Sweden|🇸🇪)/i },
	{ code: "NO", name: "挪威", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/no.svg", regex: /^(?!.*(none|node|annoy|cf_no1|technolog)).*(挪威|NO|Norway|🇳🇴)/i },
	{ code: "CN", name: "中国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/cn.svg", regex: /^(?!.*(台湾|香港|TW|CN_d)).*(中国|CN|China|PRC|🇨🇳)/i },
	{ code: "MY", name: "马来西亚", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/my.svg", regex: /^(?!.*(myshadow)).*(马来西亚|MY|Malaysia|🇲🇾)/i },
	{ code: "VN", name: "越南", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/vn.svg", regex: /(越南|VN|Vietnam|🇻🇳)/i },
	{ code: "PH", name: "菲律宾", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ph.svg", regex: /^(?!.*(phoenix|phx)).*(菲律宾|PH|Philippines|🇵🇭)/i },
	{ code: "TH", name: "泰国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/th.svg", regex: /^(?!.*(GTHost|pathx)).*(泰国|TH|Thailand|🇹🇭)/i },
	{ code: "ID", name: "印度尼西亚", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/id.svg", regex: /(印度尼西亚|ID|Indonesia|🇮🇩)/i },
	{ code: "AR", name: "阿根廷", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ar.svg", regex: /^(?!.*(warp|arm|flare|star|shar|par|akihabara|bavaria)).*(阿根廷|AR|Argentina|🇦🇷)/i },
	{ code: "NG", name: "尼日利亚", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ng.svg", regex: /^(?!.*(ong|ing|angeles|ang|ung)).*(尼日利亚|NG|Nigeria|🇳🇬)(?!.*(Hongkong|Singapore))/i },
	{ code: "TR", name: "土耳其", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/tr.svg", regex: /^(?!.*(trojan|str|central)).*(土耳其|TR|Turkey|🇹🇷)/i },
	{ code: "ES", name: "西班牙", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/es.svg", regex: /^(?!.*(vless|angeles|vmess|seychelles|business|ies|reston)).*(西班牙|ES|Spain|🇪🇸)/i },
	{ code: "AT", name: "奥地利", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/at.svg", regex: /^(?!.*(Gate)).*(奥地利|AT|Austria|🇦🇹)/i },
	{ code: "MX", name: "墨西哥", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/mx.svg", regex: /(墨西哥|MX|Mexico|🇲🇽)/i },
	{ code: "EE", name: "爱沙尼亚", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ee.svg", regex: /^(?!.*(free)).*(爱沙尼亚|EE|Estonia|🇪🇪)/i },
	{ code: "PL", name: "波兰", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/pl.svg", regex: /(波兰|PL|Poland|🇵🇱)/i },
	{ code: "IR", name: "伊朗", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ir.svg", regex: /(伊朗|IR|Iran|🇮🇷)/i },
	{ code: "ZA", name: "南非", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/za.svg", regex: /(南非|ZA|South Africa|🇿🇦)/i },
	{ code: "CO", name: "哥伦比亚", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/co.svg", regex: /(哥伦比亚|CO|Colombia|🇨🇴)/i },
	{ code: "SA", name: "沙特阿拉伯", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/sa.svg", regex: /^(?!.*(usa|sakura)).*(沙特阿拉伯|沙特|SA|Saudi Arabia|🇸🇦)/i },
	{ code: "CL", name: "智利", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/cl.svg", regex: /^(?!.*(cloud)).*(智利|CL|Chile|🇨🇱)/i },
];

function getTestUrlForGroup(groupName) {
	switch (groupName) {
	case "Shared Chat":
		return "https://shared.oaifree.com/";
	case "Steam":
		return "https://store.steampowered.com/";
	case "Telegram":
		return "https://web.telegram.org/";
	case "ChatGPT":
		return "https://chat.openai.com/";
	case "Claude":
		return "https://claude.ai/";
	case "Spotify":
		return "https://www.spotify.com/";
	case "Google":
		return "http://google.com/";
	case "Microsoft":
		return "http://msn.com/";
	case "Linux Do":
		return "https://linux.do/";
	default:
		return "http://www.gstatic.com/generate_204";
	}
}

function getIconForGroup(groupName) {
	switch (groupName) {
	case "Shared Chat":
		return "https://linux.do/user_avatar/linux.do/neo/144/12_2.png";
	case "Linux Do":
		return "https://linux.do/uploads/default/original/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994.png";
	case "Steam":
		return "https://fastly.jsdelivr.net/gh/Orz-3/mini@master/Color/Steam.png";
	case "SteamCN":
		return "https://fastly.jsdelivr.net/gh/Orz-3/mini@master/Color/Steam.png";
	case "Telegram":
		return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/telegram.png";
	case "ChatGPT":
		return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/openai.png";
	case "Claude":
		return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/anthropic.png";
	case "Spotify":
		return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/spotify.png";
	case "Google":
		return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/google.png";
	case "Microsoft":
		return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/microsoft.png";
	case "漏网之鱼":
		return "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg";
	case "广告拦截":
		return "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/block.svg";
	default:
		return "";
	}
}

const customRules = [
  // 自定义规则
  "DOMAIN-SUFFIX,googleapis.cn," + proxyName, // Google服务
  "DOMAIN-SUFFIX,gstatic.com," + proxyName, // Google静态资源
  "DOMAIN-SUFFIX,xn--ngstr-lra8j.com," + proxyName, // Google Play下载服务
  "DOMAIN-SUFFIX,github.io," + proxyName, // Github Pages
  "DOMAIN,v2rayse.com," + proxyName, // V2rayse节点工具
  "DOMAIN,hajimi.icu," + proxyName, 
	"DOMAIN-SUFFIX,linux.do,Linux Do",
	"DOMAIN-SUFFIX,shared.oaifree.com,Shared Chat",
	"IP-CIDR,183.230.113.152/32,REJECT",
	"IP-CIDR,1.12.12.12/32,代理模式", 
	"DOMAIN,f3b7q2p3.ssl.hwcdn.net,SteamCN",
	"DOMAIN,steammobile.akamaized.net,SteamCN",
	"DOMAIN,steampipe-kr.akamaized.net,SteamCN",
	"DOMAIN,steampipe-partner.akamaized.net,SteamCN",
	"DOMAIN-SUFFIX,cdn-ali.content.steamchina.com,SteamCN",
	"DOMAIN-SUFFIX,cdn-qc.content.steamchina.com,SteamCN",
	"DOMAIN-SUFFIX,cdn-ws.content.steamchina.com,SteamCN",
	"DOMAIN-SUFFIX,cm.steampowered.com,SteamCN",
	"DOMAIN-SUFFIX,csgo.wmsj.cn,SteamCN",
	"DOMAIN-SUFFIX,dl.steam.clngaa.com,SteamCN",
	"DOMAIN-SUFFIX,dl.steam.ksyna.com,SteamCN",
	"DOMAIN-SUFFIX,dota2.wmsj.cn,SteamCN",
	"DOMAIN-SUFFIX,edge.steam-dns.top.comcast.net,SteamCN",
	"DOMAIN-SUFFIX,fanatical.com,SteamCN",
	"DOMAIN-SUFFIX,humblebundle.com,SteamCN",
	"DOMAIN-SUFFIX,playartifact.com,SteamCN",
	"DOMAIN-SUFFIX,s.team,SteamCN",
	"DOMAIN-SUFFIX,st.dl.bscstorage.net,SteamCN",
	"DOMAIN-SUFFIX,st.dl.eccdnx.com,SteamCN",
	"DOMAIN-SUFFIX,st.dl.pinyuncloud.com,SteamCN",
	"DOMAIN-SUFFIX,steam-api.com,SteamCN",
	"DOMAIN-SUFFIX,steam-chat.com,SteamCN",
	"DOMAIN-SUFFIX,steam.apac.qtlglb.com,SteamCN",
	"DOMAIN-SUFFIX,steam.cdn.on.net,SteamCN",
	"DOMAIN-SUFFIX,steam.cdn.orcon.net.nz,SteamCN",
	"DOMAIN-SUFFIX,steam.cdn.slingshot.co.nz,SteamCN",
	"DOMAIN-SUFFIX,steam.cdn.webra.ru,SteamCN",
	"DOMAIN-SUFFIX,steam.eca.qtlglb.com,SteamCN",
	"DOMAIN-SUFFIX,steam.naeu.qtlglb.com,SteamCN",
	"DOMAIN-SUFFIX,steam.ru.qtlglb.com,SteamCN",
	"DOMAIN-SUFFIX,steambroadcast.akamaized.net,SteamCN",
	"DOMAIN-SUFFIX,steamcdn-a.akamaihd.net,SteamCN",
	"DOMAIN-SUFFIX,steamcommunity-a.akamaihd.net,SteamCN",
	"DOMAIN-SUFFIX,steamcommunity.com,SteamCN",
	"DOMAIN-SUFFIX,steamcontent.tnkjmec.com,SteamCN",
	"DOMAIN-SUFFIX,steamdeck.com,SteamCN",
	"DOMAIN-SUFFIX,steamgames.com,SteamCN",
	"DOMAIN-SUFFIX,steampipe.akamaized.net,SteamCN",
	"DOMAIN-SUFFIX,steampowered.com,SteamCN",
	"DOMAIN-SUFFIX,steampowered.com.8686c.com,SteamCN",
	"DOMAIN-SUFFIX,steamserver.net,SteamCN",
	"DOMAIN-SUFFIX,steamstat.us,SteamCN",
	"DOMAIN-SUFFIX,steamstatic.com,SteamCN",
	"DOMAIN-SUFFIX,steamstatic.com.8686c.com,SteamCN",
	"DOMAIN-SUFFIX,steamstore-a.akamaihd.net,SteamCN",
	"DOMAIN-SUFFIX,steamunlocked.net,SteamCN",
	"DOMAIN-SUFFIX,steamusercontent-a.akamaihd.net,SteamCN",
	"DOMAIN-SUFFIX,steamuserimages-a.akamaihd.net,SteamCN",
	"DOMAIN-SUFFIX,steamvideo-a.akamaihd.net,SteamCN",
	"DOMAIN-SUFFIX,underlords.com,SteamCN",
	"DOMAIN-SUFFIX,valvesoftware.com,SteamCN",
	"DOMAIN-SUFFIX,wmsjsteam.com,SteamCN",
	"DOMAIN-KEYWORD,steambroadcast,SteamCN",
	"DOMAIN-KEYWORD,steamstore,SteamCN",
	"DOMAIN-KEYWORD,steamuserimages,SteamCN",	
];

function overwriteRules(params) {
	const rules = [
		...customRules,
		"RULE-SET,steam,Steam",
		"RULE-SET,telegramcidr,Telegram,no-resolve",
		"RULE-SET,openai,ChatGPT",
		"RULE-SET,claude,Claude",
		"RULE-SET,spotify,Spotify",
		"RULE-SET,google,Google",
		"RULE-SET,microsoft,Microsoft",
		"GEOIP,CN,DIRECT,no-resolve",
		"GEOIP,LAN,DIRECT,no-resolve",
		"GEOSITE,geolocation-cn,DIRECT",
		"RULE-SET,direct,DIRECT",
		"RULE-SET,cncidr,DIRECT,no-resolve",
		"RULE-SET,private,DIRECT",
		"RULE-SET,lancidr,DIRECT,no-resolve",
		"RULE-SET,applications,DIRECT",
		"RULE-SET,bytedance,DIRECT",
		"RULE-SET,steamcn,DIRECT",
		"RULE-SET,apple," + proxyName,
		"RULE-SET,icloud," + proxyName,
		// "RULE-SET,greatfire," + proxyName,
		"RULE-SET,reject,广告拦截",
		"RULE-SET,AD,广告拦截",
		"RULE-SET,EasyList,广告拦截",
		"RULE-SET,EasyListChina,广告拦截",
		"RULE-SET,EasyPrivacy,广告拦截",
		"RULE-SET,ProgramAD,广告拦截",
		"RULE-SET,gfw," + proxyName,
		"RULE-SET,proxy," + proxyName,
		"RULE-SET,tld-not-cn," + proxyName,
		"MATCH,漏网之鱼",
	];
  // 规则集通用配置
  const ruleProviderCommon = {
    "type": "http",
    "format": "yaml",
    "interval": 86400
  };	
  // 规则集配置
  const ruleProviders = {
    "reject": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt",
      "path": "./ruleset/loyalsoldier/reject.yaml"
    },
    "icloud": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt",
      "path": "./ruleset/loyalsoldier/icloud.yaml"
    },
    "apple": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt",
      "path": "./ruleset/loyalsoldier/apple.yaml"
    },
    "google": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt",
      "path": "./ruleset/loyalsoldier/google.yaml"
    },
    "proxy": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt",
      "path": "./ruleset/loyalsoldier/proxy.yaml"
    },
    "direct": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt",
      "path": "./ruleset/loyalsoldier/direct.yaml"
    },
    "private": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt",
      "path": "./ruleset/loyalsoldier/private.yaml"
    },
    "gfw": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt",
      "path": "./ruleset/loyalsoldier/gfw.yaml"
    },
    "tld-not-cn": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt",
      "path": "./ruleset/loyalsoldier/tld-not-cn.yaml"
    },
    "telegramcidr": {
      ...ruleProviderCommon,
      "behavior": "ipcidr",
      "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt",
      "path": "./ruleset/loyalsoldier/telegramcidr.yaml"
    },
    "cncidr": {
      ...ruleProviderCommon,
      "behavior": "ipcidr",
      "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt",
      "path": "./ruleset/loyalsoldier/cncidr.yaml"
    },
    "lancidr": {
      ...ruleProviderCommon,
      "behavior": "ipcidr",
      "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt",
      "path": "./ruleset/loyalsoldier/lancidr.yaml"
    },
    "applications": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt",
      "path": "./ruleset/loyalsoldier/applications.yaml"
    },
    "openai": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/OpenAI/OpenAI.yaml",
      "path": "./ruleset/blackmatrix7/openai.yaml"
    },
    "microsoft": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Microsoft/Microsoft.yaml",
      "path": "./ruleset/blackmatrix7/microsoft.yaml"
    },
    "steamcn": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/SteamCN/SteamCN.yaml",
      "path": "./ruleset/blackmatrix7/steamcn.yaml"
    },
    "bytedance": {
        ...ruleProviderCommon,
        "behavior": "classical",
        "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/ByteDance/ByteDance.yaml",
        "path": "./ruleset/blackmatrix7/bytedance.yaml"
    },
    "facebook": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Facebook/Facebook.yaml",
      "path": "./ruleset/blackmatrix7/facebook.yaml"
    },
    "claude": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Claude/Claude.yaml",
      "path": "./ruleset/blackmatrix7/claude.yaml"
    },
		"steam": {
			...ruleProviderCommon,
			behavior: "classical",
			url: "https://fastly.jsdelivr.net/gh/yangtb2024/Mihomo-Rules@refs/heads/main/Steam.txt",
			path: "./ruleset/yangtb2024/steam.yaml"
		},
		"spotify": {
			...ruleProviderCommon,
			behavior: "classical",
			url: "https://fastly.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Spotify/Spotify.yaml",
			path: "./ruleset/blackmatrix7/Spotify.yaml"
		},
		"greatfire": {
			...ruleProviderCommon,
			behavior: "domain",
			url: "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/greatfire.txt",
			path: "./ruleset/Loyalsoldier/greatfire.yaml"
		},
		"AD": {
		  ...ruleProviderCommon,
		  behavior: "domain",
		  url: "https://fastly.jsdelivr.net/gh/earoftoast/clash-rules@main/AD.yaml",
		  path: "./ruleset/earoftoast/AD.yaml"
		},
		"EasyList": {
		  ...ruleProviderCommon,
		  behavior: "domain",
		  url: "https://fastly.jsdelivr.net/gh/earoftoast/clash-rules@main/EasyList.yaml",
		  path: ".ruleset/earoftoast/EasyList.yaml"
		},
		"EasyListChina": {
		  ...ruleProviderCommon,
		  behavior: "domain",
		  url: "https://fastly.jsdelivr.net/gh/earoftoast/clash-rules@main/EasyListChina.yaml",
		  path: "./ruleset/earoftoast/EasyListChina.yaml"
		},
		"EasyPrivacy": {
		  ...ruleProviderCommon,
		  behavior: "domain",
		  url: "https://fastly.jsdelivr.net/gh/earoftoast/clash-rules@main/EasyPrivacy.yaml",
		  path: "./ruleset/earoftoast/EasyPrivacy.yaml"
		},
		"ProgramAD": {
		  ...ruleProviderCommon,
		  behavior: "domain",
		  url: "https://fastly.jsdelivr.net/gh/earoftoast/clash-rules@main/ProgramAD.yaml",
		  path: "./ruleset/earoftoast/ProgramAD.yaml"
		},
  };
	
	params["rule-providers"] = ruleProviders;
	params["rules"] = rules;
}

function overwriteProxyGroups(params) {
  const allProxies = params["proxies"].map((e) => e.name);

  const availableCountryCodes = new Set();
  const otherProxies = [];
  for (const proxy of params["proxies"]) {
    let bestMatch = null;
    let longestMatchLength = 0;

    for (const region of countryRegions) {
      const match = proxy.name.match(region.regex);
      if (match) {
        if (match[0].length > longestMatchLength) {
          longestMatchLength = match[0].length;
          bestMatch = region.code;
        }
      }
    }

    if (bestMatch) {
      availableCountryCodes.add(bestMatch);
    } else {
      otherProxies.push(proxy.name);
    }
  }

  availableCountryCodes.add("CN");

  const autoProxyGroupRegexs = countryRegions
    .filter(region => availableCountryCodes.has(region.code))
    .map(region => ({
      name: `${region.code} - 自动选择`,
      regex: region.regex,
    }));

  const autoProxyGroups = autoProxyGroupRegexs
    .map((item) => ({
      name: item.name,
      type: "url-test",
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 50,
      proxies: getProxiesByRegex(params, item.regex),
      hidden: true,
    }))
    .filter((item) => item.proxies.length > 0);

  const manualProxyGroupsConfig = countryRegions
    .filter(region => availableCountryCodes.has(region.code))
    .map(region => ({
      name: `${region.code} - 手动选择`,
      type: "select",
      proxies: getManualProxiesByRegex(params, region.regex),
      icon: region.icon,
      hidden: false,
    })).filter(item => item.proxies.length > 0);

  let otherManualProxyGroup = null;
  let otherAutoProxyGroup = null;

  if (otherProxies.length > 0) {
    otherManualProxyGroup = {
      name: "其它 - 手动选择",
      type: "select",
      proxies: otherProxies,
      icon: "https://www.clashverge.dev/assets/icons/guard.svg",
      hidden: false,
    };

    otherAutoProxyGroup = {
      name: "其它 - 自动选择",
      type: "url-test",
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 50,
      proxies: otherProxies,
      hidden: true,
    };
  }

  const groups = [
    {
      name: proxyName,
      type: "select",
      url: "http://www.gstatic.com/generate_204",
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg",
      proxies: ["自动选择", "手动选择", "负载均衡 (散列)", "负载均衡 (轮询)", "DIRECT"],
    },

    {
      name: "手动选择",
      type: "select",
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg",
      proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
    },

    {
      name: "自动选择",
      type: "select",
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg",
      proxies: ["ALL - 自动选择", ...autoProxyGroups
        .filter(group => !["Shared Chat", "Steam", "Telegram", "ChatGPT", "Claude", "Spotify", "Google", "Microsoft", "Linux Do"].includes(group.name))
        .map(group => group.name), otherAutoProxyGroup ? otherAutoProxyGroup.name : null].filter(Boolean),
    },

    {
      name: "负载均衡 (散列)",
      type: "load-balance",
      url: "http://www.gstatic.com/generate_204",
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/balance.svg",
      interval: 300,
      "max-failed-times": 3,
      strategy: "consistent-hashing",
      lazy: true,
      proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
      hidden: true,
    },

    {
      name: "负载均衡 (轮询)",
      type: "load-balance",
      url: "http://www.gstatic.com/generate_204",
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/merry_go.svg",
      interval: 300,
      "max-failed-times": 3,
      strategy: "round-robin",
      lazy: true,
      proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
      hidden: true,
    },

    {
      name: "ALL - 自动选择",
      type: "url-test",
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 50,
      proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
      hidden: true,
    },
    {
      name: "SteamCN",
      type: "select",
      proxies: ["DIRECT", proxyName],
      icon: "https://fastly.jsdelivr.net/gh/Orz-3/mini@master/Color/Steam.png",
      hidden: false,
    },
    {
      name: "Shared Chat",
      type: "select",
      url: getTestUrlForGroup("Shared Chat"),
      icon: getIconForGroup("Shared Chat"),
      proxies: [
        "DIRECT",
        proxyName,
        "ALL - 自动选择 - Shared Chat", 
        ...countryRegions
          .filter(region => availableCountryCodes.has(region.code))
          .flatMap(region => [
            `${region.code} - 自动选择 - Shared Chat`,
            `${region.code} - 手动选择`,
          ]),
        otherAutoProxyGroup ? `${otherAutoProxyGroup.name} - Shared Chat` : null,
      ].filter(Boolean),
    },
    ...["Steam","Telegram", "ChatGPT", "Claude", "Spotify", "Google", "Microsoft", "Linux Do"].map(groupName => ({
      name: groupName,
      type: "select",
      url: getTestUrlForGroup(groupName),
      icon: getIconForGroup(groupName),
      proxies: [
        proxyName,
        "DIRECT",
        `ALL - 自动选择 - ${groupName}`, 
        ...countryRegions
          .filter(region => availableCountryCodes.has(region.code))
          .flatMap(region => [
            `${region.code} - 自动选择 - ${groupName}`, 
            `${region.code} - 手动选择`,
          ]),
        otherAutoProxyGroup ? `${otherAutoProxyGroup.name} - ${groupName}` : null,
      ].filter(Boolean),
    })),

    {
      name: "漏网之鱼",
      type: "select",
      proxies: ["DIRECT", proxyName],
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg",
      hidden: false,
    },

    {
      name: "广告拦截",
      type: "select",
      proxies: ["REJECT", "DIRECT", proxyName],
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/block.svg",
      hidden: false,
    },
  ];

  const websiteSpecificAutoGroups = ["Shared Chat", "Steam", "Telegram", "ChatGPT", "Claude", "Spotify", "Google", "Microsoft", "Linux Do"].flatMap(groupName => {
    return [
      {
        name: `ALL - 自动选择 - ${groupName}`,
        type: "url-test",
        url: getTestUrlForGroup(groupName), 
        interval: 300,
        tolerance: 50,
        proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
        hidden: true,
      },
      ...autoProxyGroupRegexs.map(item => ({
        name: `${item.name} - ${groupName}`,
        type: "url-test",
        url: getTestUrlForGroup(groupName),
        interval: 300,
        tolerance: 50,
        proxies: getProxiesByRegex(params, item.regex),
        hidden: true,
      })).filter(item => item.proxies.length > 0),
      ...(otherAutoProxyGroup ? [{
        name: `${otherAutoProxyGroup.name} - ${groupName}`,
        type: "url-test",
        url: getTestUrlForGroup(groupName), 
        interval: 300,
        tolerance: 50,
        proxies: otherProxies,
        hidden: true,
      }] : []),
    ];
  });


  if (otherAutoProxyGroup) {
    autoProxyGroups.push(otherAutoProxyGroup);
  }

  groups.push(...autoProxyGroups);
  groups.push(...manualProxyGroupsConfig);
  if (otherManualProxyGroup) {
    groups.push(otherManualProxyGroup);
  }
  groups.push(...websiteSpecificAutoGroups); 
  params["proxy-groups"] = groups;
}

function overwriteDns(params, proxyName) {
  const cnDnsList = [
    "https://223.5.5.5/dns-query",
    "https://1.12.12.12/dns-query",
  ];
  const trustDnsList = [
    "quic://dns.cooluc.com",
    "https://1.1.1.1/dns-query", // Cloudflare(主)
    "https://1.0.0.1/dns-query", // Cloudflare(备)
    "https://208.67.222.222/dns-query", // OpenDNS(主)
    "https://208.67.220.220/dns-query", // OpenDNS(备)
    "https://194.242.2.2/dns-query", // Mullvad(主)
    "https://194.242.2.3/dns-query", // Mullvad(备)
    "https://cloudflare-dns.com/dns-query",
  ];

  const dnsOptions = {
    enable: true,
    "prefer-h3": true, // 如果 DNS 服务器支持 DoH3 会优先使用 h3
    "default-nameserver": cnDnsList, // 用于解析其他 DNS 服务器、和节点的域名，必须为 IP, 可为加密 DNS。注意这个只用来解析节点和其他的 dns，其他网络请求不归他管
    nameserver: trustDnsList, // 其他网络请求都归他管
    "nameserver-policy": {
      "http-inputs-notion.splunkcloud.com,+.notion-static.com,+.notion.com,+.notion.new,+.notion.site,+.notion.so": "tls://dns.jerryw.cn", 
      "geosite:cn": cnDnsList,
      "geoip:cn": cnDnsList,
      "DOMAIN-SUFFIX,shared.oaifree.com": cnDnsList,
      "geosite:geolocation-!cn": trustDnsList,
      "domain:google.com,facebook.com,youtube.com,twitter.com,github.com,cloudflare.com,jsdelivr.net,hf.space":
        trustDnsList,
      // 如果你有一些内网使用的 DNS，应该定义在这里，多个域名用英文逗号分割
      // '+. 公司域名.com, www.4399.com, +.baidu.com': '10.0.0.1'
    },
    fallback: trustDnsList,
    "fallback-filter": {
      "response-code": "REFUSED,SERVFAIL,NXDOMAIN",
        geoip: true,
        // 除了 geoip-code 配置的国家 IP, 其他的 IP 结果会被视为污染 geoip-code 配置的国家的结果会直接采用，否则将采用 fallback 结果
        "geoip-code": "CN",
        //geosite 列表的内容被视为已污染，匹配到 geosite 的域名，将只使用 fallback 解析，不去使用 nameserver
        geosite: ["gfw"],
        ipcidr: ["240.0.0.0/4"],
        domain: ["+.google.com", "+.facebook.com", "+.youtube.com"],
    },
    "enhanced-mode": "redir-host-with-ipv6",
    "fake-ip-range": "198.18.0.0/16",
    "system-dns": [],
    "use-hosts": true,
    "listen": "0.0.0.0:5353",

    "query-strategy": "USE_PROXY",
    cache: {
      enable: true,
      size: 4096,
      expire: 3600,
    },
  };

  const githubPrefix = "https://fastgh.lainbo.com/";
  const rawGeoxURLs = {
    geoip:
      "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip-lite.dat",
    geosite:
      "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat",
    mmdb:
      "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/country-lite.mmdb",
  };
  const accelURLs = Object.fromEntries(
    Object.entries(rawGeoxURLs).map(([key, githubUrl]) => [
      key,
      `${githubPrefix}${githubUrl}`,
    ])
  );

  const otherOptions = {
    "unified-delay": true,
    "tcp-concurrent": true,
    profile: { "store-selected": true, "store-fake-ip": true },
    sniffer: {
      enable: true,
      sniff: {
        TLS: { ports: [443, 8443] },
        QUIC: { ports: [443, 8443] },
        HTTP: { ports: [80, "8080-8880"], "override-destination": true },
      },
    },
    "geodata-mode": true,
    "geox-url": accelURLs,
    "geo-auto-update": true,
    "geo-update-interval": 24,
    "fake-ip-filter": ["geoip:cn", 
      // 本地主机/设备
      "+.lan",
      "+.local",
      // Windows网络出现小地球图标
      "+.msftconnecttest.com",
      "+.msftncsi.com",
      // QQ快速登录检测失败
      "localhost.ptlogin2.qq.com",
      "localhost.sec.qq.com",
      // 微信快速登录检测失败
      "localhost.work.weixin.qq.com"],
  };

  params.dns = { ...params.dns, ...dnsOptions };
  Object.keys(otherOptions).forEach((key) => {
    params[key] = otherOptions[key];
  });

  params.rules = params.rules || [];
  params.rules.unshift("DOMAIN-KEYWORD,dns,代理模式");
}	

function getProxiesByRegex(params, regex) {
	const matchedProxies = params.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
	return matchedProxies.length > 0 ? matchedProxies : ["手动选择"];
}

function getManualProxiesByRegex(params, regex) {
	const matchedProxies = params.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
//	return regex.test("CN") ? ["DIRECT", ...matchedProxies]: matchedProxies.length > 0 ? matchedProxies : ["DIRECT", "手动选择", proxyName];
	return matchedProxies.length > 0 ? matchedProxies : ["DIRECT", "手动选择", proxyName];
}
