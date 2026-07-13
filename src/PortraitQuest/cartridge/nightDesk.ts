import type { EventCard, ThemeCartridge } from '../types';

const events: EventCard[] = [
  {
    id: 'room-000', deskCode: '000', minRound: 1, maxRound: 2,
    title: { zh: '没有登记的房间', en: 'The Unregistered Room' },
    body: { zh: '总机亮起 000 号房。酒店图纸上没有这一层，听筒里却有人准确叫出你的名字。', en: 'Room 000 lights up on the switchboard. No such floor exists, yet the caller knows your name.' },
    choices: [
      { label: { zh: '接通电话', en: 'Take the call' }, outcome: { zh: '对方只说：“你终于值这班了。”', en: 'The voice only says, “At last, you took the shift.”' }, effects: { calm: -8, truth: 12 }, portrait: 'worried', addFlags: ['investigate', 'heard_name'] },
      { label: { zh: '拔掉线路', en: 'Pull the line' }, outcome: { zh: '灯灭了，但你的名字留在值班簿上。', en: 'The light dies. Your name remains in the ledger.' }, effects: { order: 8, trust: -5, truth: -4 }, portrait: 'defiant', addFlags: ['obey'] },
    ],
  },
  {
    id: 'wet-guest', deskCode: '014', minRound: 1, maxRound: 4,
    title: { zh: '浑身湿透的客人', en: 'The Drenched Guest' },
    body: { zh: '一个没有带伞的人站在柜台前，脚下不断积水。今晚没有下雨。', en: 'A guest without an umbrella leaves a widening pool on the floor. It has not rained tonight.' },
    choices: [
      { label: { zh: '递上房卡', en: 'Offer a key' }, outcome: { zh: '客人微笑，水迹停在 14 号房门前。', en: 'The guest smiles. The water trail ends at Room 14.' }, effects: { trust: 12, order: -8, calm: -3 }, portrait: 'worried', addFlags: ['welcomed_guest'] },
      { label: { zh: '请他离开', en: 'Turn them away' }, outcome: { zh: '他离开后，所有水龙头同时哭了起来。', en: 'After they leave, every faucet begins to weep.' }, effects: { order: 10, trust: -10, calm: -4 }, portrait: 'defiant', addFlags: ['obey'] },
    ],
  },
  {
    id: 'sleeping-bell', deskCode: 'BELL', minRound: 2, maxRound: 5,
    title: { zh: '自己响起的铜铃', en: 'The Bell Rings Alone' },
    body: { zh: '柜台铜铃响了三次。大厅里没有人，第三声却从你的口袋里传来。', en: 'The desk bell rings three times. The lobby is empty. The third ring comes from your pocket.' },
    choices: [
      { label: { zh: '掏出口袋里的东西', en: 'Reach inside' }, outcome: { zh: '你摸到一把刻着明日日期的钥匙。', en: 'You find a key engraved with tomorrow’s date.' }, effects: { calm: -5, truth: 14, order: -3 }, portrait: 'worried', addFlags: ['investigate', 'tomorrow_key'] },
      { label: { zh: '假装没有听见', en: 'Ignore it' }, outcome: { zh: '铜铃安静了，值班表少掉了一个小时。', en: 'The bell falls silent. An hour vanishes from the roster.' }, effects: { calm: 8, truth: -9, trust: -3 }, portrait: 'neutral', addFlags: ['obey'] },
    ],
  },
  {
    id: 'mirror-request', deskCode: '208', minRound: 2, maxRound: 6,
    title: { zh: '镜子的客房服务', en: 'Room Service for a Mirror' },
    body: { zh: '208 号房要一份双人早餐。登记簿显示房内只有一面落地镜。', en: 'Room 208 orders breakfast for two. The ledger lists only a floor-length mirror.' },
    choices: [
      { label: { zh: '送两份早餐', en: 'Send two trays' }, outcome: { zh: '托盘空着回来，镜面上多了一张你的座位卡。', en: 'The trays return empty. The mirror now holds a place card with your name.' }, effects: { trust: 10, truth: 9, order: -7 }, portrait: 'worried', addFlags: ['investigate', 'mirror_knows'] },
      { label: { zh: '取消订单', en: 'Cancel the order' }, outcome: { zh: '208 号房从门牌序列中消失了。', en: 'Room 208 disappears from the hallway numbers.' }, effects: { order: 12, truth: -8, trust: -4 }, portrait: 'defiant', addFlags: ['obey'] },
    ],
  },
  {
    id: 'lost-child', deskCode: 'CHLD', minRound: 3, maxRound: 7,
    title: { zh: '寻找昨天的孩子', en: 'The Child Looking for Yesterday' },
    body: { zh: '一个孩子说她把昨天落在电梯里了。她愿意用明天交换。', en: 'A child says she left yesterday in the elevator. She offers tomorrow in exchange.' },
    choices: [
      { label: { zh: '陪她去找', en: 'Help her search' }, outcome: { zh: '电梯停在十三楼半。你记起一件从未发生过的事。', en: 'The lift stops at floor thirteen-and-a-half. You remember something that never happened.' }, effects: { calm: -10, trust: 12, truth: 8 }, portrait: 'worried', addFlags: ['investigate', 'half_floor'] },
      { label: { zh: '交给保安', en: 'Call security' }, outcome: { zh: '保安说酒店从未雇过他，但还是带走了孩子。', en: 'Security says the hotel never hired him, then escorts her away.' }, effects: { order: 11, trust: -11, truth: -3 }, portrait: 'defiant', addFlags: ['obey'] },
    ],
  },
  {
    id: 'borrowed-face', deskCode: 'MASK', minRound: 3, maxRound: 8,
    title: { zh: '借脸的住客', en: 'The Guest Borrowing Faces' },
    body: { zh: '一位住客说房门不认他了。他想借你的脸刷开门锁，只用一分钟。', en: 'A guest says his door no longer recognizes him. He asks to borrow your face for one minute.' },
    choices: [
      { label: { zh: '让他试试', en: 'Let him try' }, outcome: { zh: '门开了。监控里走进去的人看起来比你更像你。', en: 'The door opens. On camera, the person entering looks more like you than you do.' }, effects: { trust: 9, truth: 11, calm: -12 }, portrait: 'worried', addFlags: ['investigate', 'borrowed_face'] },
      { label: { zh: '拒绝请求', en: 'Refuse' }, outcome: { zh: '他摘下自己的脸，放在柜台上等候。', en: 'He removes his own face and leaves it waiting on the desk.' }, effects: { order: 9, calm: -7, trust: -8 }, portrait: 'defiant', addFlags: ['obey'] },
    ],
  },
  {
    id: 'old-manager', deskCode: 'MGR', minRound: 4, maxRound: 9,
    title: { zh: '上一任值班经理', en: 'The Previous Night Manager' },
    body: { zh: '办公室传来敲门声。档案说上一任经理三十年前仍在值班。', en: 'Someone knocks from inside the office. Records say the previous manager is still on shift—thirty years later.' },
    choices: [
      { label: { zh: '打开办公室', en: 'Open the office' }, outcome: { zh: '里面只有一件和你尺寸完全相同的制服。', en: 'Inside waits a uniform tailored exactly to your measurements.' }, effects: { truth: 13, calm: -9, order: -4 }, portrait: 'worried', addFlags: ['investigate', 'manager_uniform'] },
      { label: { zh: '把门锁死', en: 'Seal the door' }, outcome: { zh: '敲门声转移到了你的胸腔里面。', en: 'The knocking moves inside your ribcage.' }, effects: { order: 12, calm: -11, truth: -4 }, portrait: 'defiant', addFlags: ['obey'] },
    ],
  },
  {
    id: 'empty-elevator', deskCode: 'LIFT', minRound: 5, maxRound: 10,
    title: { zh: '超载的空电梯', en: 'The Overloaded Empty Lift' },
    body: { zh: '空电梯发出超载警报。显示屏上逐个亮起十二个早已退房的名字。', en: 'An empty lift sounds its overload alarm. Twelve checked-out names illuminate one by one.' },
    choices: [
      { label: { zh: '让电梯上行', en: 'Send it up' }, outcome: { zh: '每经过一层，酒店都年轻一年。', en: 'With each floor, the hotel becomes one year younger.' }, effects: { truth: 10, trust: 6, order: -12 }, portrait: 'confident', addFlags: ['investigate', 'freed_names'] },
      { label: { zh: '切断电梯电源', en: 'Cut the power' }, outcome: { zh: '十二个名字同时出现在你的值班胸牌背面。', en: 'All twelve names appear on the back of your name badge.' }, effects: { order: 13, calm: -10, trust: -7 }, portrait: 'defiant', addFlags: ['obey'] },
    ],
  },
  {
    id: 'tomorrow-key', deskCode: 'TMRW', minRound: 7, requiresAny: ['tomorrow_key'],
    title: { zh: '明日房间已经入住', en: 'Tomorrow Has Checked In' },
    body: { zh: '那把刻着明日日期的钥匙开始发热。系统显示入住人是你。', en: 'The key dated tomorrow grows warm. The system lists you as the arriving guest.' },
    choices: [
      { label: { zh: '提前退房', en: 'Check out early' }, outcome: { zh: '系统删除了你的退房日期，却保留了入住。', en: 'The system deletes your departure date, but keeps your arrival.' }, effects: { calm: -7, truth: 14, order: -5 }, portrait: 'worried', addFlags: ['investigate', 'no_checkout'] },
      { label: { zh: '销毁钥匙', en: 'Destroy the key' }, outcome: { zh: '钥匙碎了，每一片都刻着今天。', en: 'The key shatters. Every piece is dated today.' }, effects: { order: 10, calm: 5, truth: -12 }, portrait: 'defiant', addFlags: ['obey'] },
    ],
  },
  {
    id: 'mirror-double', deskCode: 'SELF', minRound: 7, requiresAny: ['mirror_knows', 'borrowed_face'],
    title: { zh: '你的替班已经到了', en: 'Your Replacement Has Arrived' },
    body: { zh: '电梯里走出另一个你。它说你已经很累，剩下的班可以交给它。', en: 'Another you steps from the lift. It says you look tired and offers to finish the shift.' },
    choices: [
      { label: { zh: '要求它证明身份', en: 'Demand proof' }, outcome: { zh: '它说出一个只有你知道的谎言。', en: 'It recites a lie only you know.' }, effects: { truth: 15, calm: -9, trust: -5 }, portrait: 'defiant', addFlags: ['investigate', 'rejected_double'] },
      { label: { zh: '把柜台交给它', en: 'Hand over the desk' }, outcome: { zh: '你走向出口，却发现胸牌上写着“住客”。', en: 'You head for the exit. Your badge now reads GUEST.' }, effects: { calm: 10, order: 8, truth: -15 }, portrait: 'exhausted', addFlags: ['obey', 'accepted_double'] },
    ],
  },
  {
    id: 'guest-vote', deskCode: 'VOTE', minRound: 8,
    title: { zh: '住客投票', en: 'The Guests Take a Vote' },
    body: { zh: '所有房门同时滑出一张选票：他们要决定谁能看见清晨。', en: 'A ballot slips beneath every door. The guests will decide who gets to see morning.' },
    choices: [
      { label: { zh: '承诺保护住客', en: 'Protect the guests' }, outcome: { zh: '信任票涌入柜台，但酒店的规则开始崩塌。', en: 'Votes of trust flood the desk as hotel rules begin to buckle.' }, effects: { trust: 16, order: -13, calm: -3 }, portrait: 'confident', addFlags: ['guest_ally'] },
      { label: { zh: '宣布投票无效', en: 'Void the vote' }, outcome: { zh: '酒店恢复安静。每扇门后的呼吸都停了。', en: 'The hotel becomes orderly. Every breath behind every door stops.' }, effects: { order: 15, trust: -15, truth: -2 }, portrait: 'defiant', addFlags: ['hotel_ally'] },
    ],
  },
  {
    id: 'fire-alarm', deskCode: 'FIRE', minRound: 8,
    title: { zh: '只为亡者响起的警报', en: 'The Alarm for the Dead' },
    body: { zh: '火警响起，但温度骤降。疏散名单上只有已经死去的住客。', en: 'The fire alarm sounds as the temperature drops. The evacuation list contains only the dead.' },
    choices: [
      { label: { zh: '按名单疏散', en: 'Follow the list' }, outcome: { zh: '半透明的队伍穿过大门，第一次没有回头。', en: 'A translucent procession crosses the lobby and, for once, does not look back.' }, effects: { trust: 13, truth: 10, order: -11 }, portrait: 'confident', addFlags: ['freed_names'] },
      { label: { zh: '关闭警报', en: 'Silence the alarm' }, outcome: { zh: '冷空气退去，名单上多了你的名字。', en: 'The cold recedes. Your name joins the list.' }, effects: { order: 14, calm: -8, truth: -7 }, portrait: 'worried', addFlags: ['obey'] },
    ],
  },
  {
    id: 'ledger-heartbeat', deskCode: 'BOOK', minRound: 9,
    title: { zh: '值班簿的心跳', en: 'The Ledger Has a Pulse' },
    body: { zh: '值班簿像胸腔一样起伏。每一页都记录着你今晚没有做出的选择。', en: 'The ledger rises and falls like a chest. Every page records a choice you did not make.' },
    choices: [
      { label: { zh: '读完另一种人生', en: 'Read the other life' }, outcome: { zh: '你获得了答案，也失去了一段确定的记忆。', en: 'You gain an answer and lose one memory you trusted.' }, effects: { truth: 16, calm: -12, order: -3 }, portrait: 'exhausted', addFlags: ['investigate', 'read_ledger'] },
      { label: { zh: '合上值班簿', en: 'Close the ledger' }, outcome: { zh: '书页夹住一声尚未说出口的求救。', en: 'The pages trap a cry for help before it can be spoken.' }, effects: { calm: 9, order: 8, trust: -12 }, portrait: 'defiant', addFlags: ['obey'] },
    ],
  },
  {
    id: 'lobby-sunrise', deskCode: 'DAWN', minRound: 10,
    title: { zh: '伪造的日出', en: 'A Counterfeit Sunrise' },
    body: { zh: '大厅窗外亮了起来，但墙上的钟仍是 4:44。光线没有温度，也没有影子。', en: 'The lobby windows brighten, but the clock remains at 4:44. The light has no warmth and casts no shadows.' },
    choices: [
      { label: { zh: '拉开窗帘', en: 'Open the curtains' }, outcome: { zh: '窗外不是城市，而是无数个仍在值夜班的你。', en: 'Beyond the glass are countless versions of you, all still on shift.' }, effects: { truth: 15, calm: -11, trust: 4 }, portrait: 'worried', addFlags: ['investigate', 'saw_shifts'] },
      { label: { zh: '封死窗户', en: 'Seal the windows' }, outcome: { zh: '假日出熄灭，酒店满意地锁上所有出口。', en: 'The false dawn dies. The hotel locks every exit in approval.' }, effects: { order: 14, truth: -10, trust: -4 }, portrait: 'defiant', addFlags: ['hotel_ally'] },
    ],
  },
  {
    id: 'final-call', deskCode: 'LAST', minRound: 11,
    title: { zh: '最后一通内线', en: 'The Final Internal Call' },
    body: { zh: '所有线路都指向柜台下方。电话那头的你问：“天亮后，谁留下？”', en: 'Every line routes beneath the desk. Your own voice asks, “When morning comes, who stays?”' },
    choices: [
      { label: { zh: '酒店留下', en: 'The hotel stays' }, outcome: { zh: '墙壁发出释然的叹息，你第一次听见出口开锁。', en: 'The walls sigh with relief. For the first time, you hear the exit unlock.' }, effects: { order: 12, calm: 6, truth: -8 }, portrait: 'resolved', addFlags: ['chose_self'] },
      { label: { zh: '我留下', en: 'I stay' }, outcome: { zh: '所有房间都归还了名字，值班簿收下了你的。', en: 'Every room returns its name. The ledger accepts yours.' }, effects: { trust: 12, truth: 10, calm: -8 }, portrait: 'resolved', addFlags: ['chose_hotel'] },
    ],
  },
  {
    id: 'quiet-corridor', deskCode: 'HUSH', minRound: 4, maxRound: 10,
    title: { zh: '过分安静的走廊', en: 'The Too-Quiet Corridor' },
    body: { zh: '三楼突然听不见任何声音，连监控画面都像在屏住呼吸。', en: 'The third floor loses every sound. Even the security feed seems to hold its breath.' },
    choices: [
      { label: { zh: '亲自上楼', en: 'Go upstairs' }, outcome: { zh: '你回来时，鞋底粘着一小片星空。', en: 'You return with a sliver of night sky stuck to your shoe.' }, effects: { calm: -8, truth: 11, trust: 4 }, portrait: 'worried', addFlags: ['investigate'] },
      { label: { zh: '锁住三楼', en: 'Lock the floor' }, outcome: { zh: '声音恢复了，只是所有人都在小声念你的名字。', en: 'Sound returns. Everyone is whispering your name.' }, effects: { order: 12, calm: -6, trust: -5 }, portrait: 'defiant', addFlags: ['obey'] },
    ],
  },
  {
    id: 'complimentary-stay', deskCode: 'COMP', minRound: 7,
    title: { zh: '酒店赠送的终身住宿', en: 'A Complimentary Lifetime Stay' },
    body: { zh: '系统自动为你升级了房型：永久套房，退房日期为空。', en: 'The system upgrades you automatically: permanent suite, no departure date.' },
    choices: [
      { label: { zh: '拒绝升级', en: 'Decline the upgrade' }, outcome: { zh: '系统标记你为“不合作的住客”。你仍然握着柜台钥匙。', en: 'The system marks you as an uncooperative guest. You still hold the desk keys.' }, effects: { calm: 5, order: -7, truth: 11 }, portrait: 'defiant', addFlags: ['chose_self', 'investigate'] },
      { label: { zh: '接受套房', en: 'Accept the suite' }, outcome: { zh: '你的值班椅向后退了一步，像是在给下一位让座。', en: 'Your desk chair slides back, making room for whoever comes next.' }, effects: { trust: 8, order: 8, truth: -13 }, portrait: 'exhausted', addFlags: ['accepted_double', 'obey'] },
    ],
  },
  {
    id: 'guestbook-blank', deskCode: 'INK', minRound: 5,
    title: { zh: '空白留言', en: 'The Blank Guestbook' },
    body: { zh: '一本从未使用过的留言簿摊在柜台上，墨水却写出：“请评价你的住宿。”', en: 'An unused guestbook opens by itself. Ink writes: “Please rate your stay.”' },
    choices: [
      { label: { zh: '写下真相', en: 'Write the truth' }, outcome: { zh: '纸页开始发光，整栋酒店第一次看见了自己。', en: 'The page glows. For the first time, the hotel sees itself.' }, effects: { truth: 14, order: -8, trust: 5 }, portrait: 'confident', addFlags: ['investigate', 'wrote_truth'] },
      { label: { zh: '留下五星好评', en: 'Leave five stars' }, outcome: { zh: '酒店赠送你一晚免费住宿，日期是永远。', en: 'The hotel awards you one free night. The date reads forever.' }, effects: { order: 9, trust: 7, truth: -12 }, portrait: 'neutral', addFlags: ['obey'] },
    ],
  },
];

export const nightDeskCartridge: ThemeCartridge = {
  id: 'night-desk',
  copy: {
    zh: {
      title: '午夜值班台', eyebrow: 'THE NIGHT DESK', subtitle: '{name}，酒店正在等你签字。',
      start: '开始值班', guide: '十二次决定。四项状态。撑到天亮。', round: '第 {round} / 12 次来电',
      continue: '继续值班', score: '本局得分', best: '历史最高', again: '再值一班', home: '返回大厅',
      dawn: '天亮了', failed: '值班中止', resultFor: '{name} 的夜班记录', loading: '正在打开值班簿…',
      hudTime: '04:44', badge: '值班中',
    },
    en: {
      title: 'THE NIGHT DESK', eyebrow: 'THE IMPOSSIBLE HOTEL', subtitle: '{name}, the hotel is waiting for your signature.',
      start: 'Take the shift', guide: 'Twelve decisions. Four gauges. Make it to dawn.', round: 'CALL {round} / 12',
      continue: 'Continue the shift', score: 'Shift score', best: 'Best shift', again: 'Work another night', home: 'Return to lobby',
      dawn: 'Dawn found you', failed: 'Shift terminated', resultFor: '{name}’s night record', loading: 'Opening the night ledger…',
      hudTime: '04:44', badge: 'ON DUTY',
    },
  },
  statLabels: {
    calm: { zh: '镇定', en: 'NERVE' }, order: { zh: '秩序', en: 'ORDER' },
    trust: { zh: '信任', en: 'TRUST' }, truth: { zh: '真相', en: 'TRUTH' },
  },
  events,
  discoveryFlags: ['heard_name', 'tomorrow_key', 'mirror_knows', 'borrowed_face', 'read_ledger', 'wrote_truth'],
  specialEndingFlags: ['wrote_truth', 'chose_self'],
  midpoint: {
    investigate: {
      title: { zh: '酒店认出了你', en: 'THE HOTEL RECOGNIZES YOU' },
      body: { zh: '第六次决定后，所有房门同时叫出你的名字。这里不是第一次见到你。', en: 'After your sixth decision, every room says your name. This is not your first night here.' },
    },
    obey: {
      title: { zh: '酒店对你很满意', en: 'THE HOTEL APPROVES' },
      body: { zh: '第六次决定后，值班簿自动续签了三十年。你的笔迹已经在上面。', en: 'After your sixth decision, the ledger renews your contract for thirty years—in your handwriting.' },
    },
  },
  endings: {
    truth: { id: 'truth', title: { zh: '带走清晨的人', en: 'THE ONE WHO TOOK DAWN' }, summary: { zh: '你让酒店第一次说出真相，并把自己的名字带出了大门。', en: 'You made the hotel tell the truth and carried your own name through the exit.' } },
    trust: { id: 'trust', title: { zh: '住客的守夜人', en: 'KEEPER OF THE GUESTS' }, summary: { zh: '住客为你打开了从不存在的出口。今后他们会记得你的善意。', en: 'The guests opened an exit that never existed. They will remember your kindness.' } },
    order: { id: 'order', title: { zh: '完美值班经理', en: 'THE PERFECT NIGHT MANAGER' }, summary: { zh: '天亮时一切井然有序。只有你的退房日期仍然空着。', en: 'At dawn, everything is in order. Only your departure date remains blank.' } },
    calm: { id: 'calm', title: { zh: '没有被酒店吞下的人', en: 'THE ONE THE HOTEL COULD NOT SWALLOW' }, summary: { zh: '你没有回答酒店最后的问题。沉默替你保住了自己。', en: 'You never answered the hotel’s final question. Silence kept you intact.' } },
    balanced: { id: 'balanced', title: { zh: '清晨的钥匙', en: 'THE KEY TO MORNING' }, summary: { zh: '四项记录保持平衡，酒店不得不承认：你不是住客，也不是员工。', en: 'With every gauge balanced, the hotel admits you are neither guest nor staff.' } },
    fail_calm: { id: 'fail_calm', title: { zh: '被夜班听见', en: 'HEARD BY THE NIGHT' }, summary: { zh: '镇定耗尽后，酒店开始用你的声音接听下一通电话。', en: 'When your nerve failed, the hotel began answering calls in your voice.' } },
    fail_order: { id: 'fail_order', title: { zh: '失控楼层', en: 'THE UNNUMBERED FLOOR' }, summary: { zh: '秩序归零，所有不存在的房间同时打开了门。', en: 'Order collapsed. Every room that did not exist opened at once.' } },
    fail_trust: { id: 'fail_trust', title: { zh: '无人作证', en: 'NO WITNESSES' }, summary: { zh: '最后一个相信你的人关上了房门，酒店改写了今晚。', en: 'The last person who trusted you closed their door. The hotel rewrote the night.' } },
    fail_truth: { id: 'fail_truth', title: { zh: '忘记自己的人', en: 'THE ONE WHO FORGOT' }, summary: { zh: '真相耗尽后，你仍记得怎么值班，却忘了为何想离开。', en: 'When truth ran out, you remembered the job and forgot why you wanted to leave.' } },
  },
};
