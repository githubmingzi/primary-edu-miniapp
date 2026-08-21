export interface Poem {
  id: string;
  title: string;
  author: string;
  dynasty: string;
  content: string[];
  emoji: string;
}

// 二年级必背古诗（部编版语文二年级上、下册）
export const poemList: Poem[] = [
  {
    id: 'pm_01',
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐',
    content: ['白日依山尽', '黄河入海流', '欲穷千里目', '更上一层楼'],
    emoji: '🌅',
  },
  {
    id: 'pm_02',
    title: '望庐山瀑布',
    author: '李白',
    dynasty: '唐',
    content: ['日照香炉生紫烟', '遥看瀑布挂前川', '飞流直下三千尺', '疑是银河落九天'],
    emoji: '🌊',
  },
  {
    id: 'pm_03',
    title: '夜宿山寺',
    author: '李白',
    dynasty: '唐',
    content: ['危楼高百尺', '手可摘星辰', '不敢高声语', '恐惊天上人'],
    emoji: '🌙',
  },
  {
    id: 'pm_04',
    title: '敕勒歌',
    author: '北朝民歌',
    dynasty: '北朝',
    content: ['敕勒川，阴山下', '天似穹庐，笼盖四野', '天苍苍，野茫茫', '风吹草低见牛羊'],
    emoji: '🐄',
  },
  {
    id: 'pm_05',
    title: '村居',
    author: '高鼎',
    dynasty: '清',
    content: ['草长莺飞二月天', '拂堤杨柳醉春烟', '儿童散学归来早', '忙趁东风放纸鸢'],
    emoji: '🪁',
  },
  {
    id: 'pm_06',
    title: '咏柳',
    author: '贺知章',
    dynasty: '唐',
    content: ['碧玉妆成一树高', '万条垂下绿丝绦', '不知细叶谁裁出', '二月春风似剪刀'],
    emoji: '🌿',
  },
  {
    id: 'pm_07',
    title: '赋得古原草送别',
    author: '白居易',
    dynasty: '唐',
    content: ['离离原上草', '一岁一枯荣', '野火烧不尽', '春风吹又生'],
    emoji: '🌱',
  },
  {
    id: 'pm_08',
    title: '晓出净慈寺送林子方',
    author: '杨万里',
    dynasty: '宋',
    content: ['毕竟西湖六月中', '风光不与四时同', '接天莲叶无穷碧', '映日荷花别样红'],
    emoji: '🌸',
  },
  {
    id: 'pm_09',
    title: '绝句',
    author: '杜甫',
    dynasty: '唐',
    content: ['两个黄鹂鸣翠柳', '一行白鹭上青天', '窗含西岭千秋雪', '门泊东吴万里船'],
    emoji: '🦜',
  },
];
