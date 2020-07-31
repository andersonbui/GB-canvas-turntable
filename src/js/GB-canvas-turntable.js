/**
 * GB-canvas-turntable.js
 * @class gbTurntable
 * @see https://github.com/givebest/GB-canvas-turntable
 * @author givenlovs@msn.com
 * @(c) 2016
 **/


(function () {
  var $,
    ele,
    container,
    canvas,
    num,
    prizes,
    btn,
    deg = 0,
    fnGetPrize,
    fnGotBack,
    optsPrize;

  var cssPrefix,
    eventPrefix,
    vendors = {
      '': '',
      Webkit: 'webkit',
      Moz: '',
      O: 'o',
      ms: 'ms'
    },
    testEle = document.createElement('p'),
    cssSupport = {};

  // 嗅探特性 - olfateando propiedades
  Object.keys(vendors).some(function (vendor) {
    if (testEle.style[vendor + (vendor ? 'T' : 't') + 'ransitionProperty'] !== undefined) {
      cssPrefix = vendor ? '-' + vendor.toLowerCase() + '-' : '';
      eventPrefix = vendors[vendor];
      return true;
    }
  });

  /**
   * [兼容事件前缀] eventos compatibles prefijo
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  function normalizeEvent(name) {
    return eventPrefix ? eventPrefix + name : name.toLowerCase();
  }

  /**
   * [兼容CSS前缀] prefijo css Compatible
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  function normalizeCss(name) {
    name = name.toLowerCase();
    return cssPrefix ? cssPrefix + name : name;
  }

  cssSupport = {
    cssPrefix: cssPrefix,
    transform: normalizeCss('Transform'),
    transitionEnd: normalizeEvent('TransitionEnd')
  }

  var transform = cssSupport.transform;
  var transitionEnd = cssSupport.transitionEnd;

  // alert(transform);
  // alert(transitionEnd);

  function init(opts) {
    fnGetPrize = opts.getPrize;
    fnGotBack = opts.gotBack;

    opts.config(function (data) {
      prizes = opts.prizes = data;
      num = prizes.length;
      draw(opts);
    });

    events();
  }

  /**
   * @param  {String} id
   * @return {Object} HTML element
   */
  $ = function (id) {
    return document.getElementById(id);
  };

  /**
   * [绘制转盘]
   * @param  {String} id
   * @param  {Number} 奖品份数
   */
  function draw(opts) {
    opts = opts || {};
    if (!opts.id || num >>> 0 === 0) return;

    var id = opts.id,
      rotateDeg = 360 / num / 2 + 90, // 扇形回转角度
      ctx,
      prizeItems = document.createElement('ul'), // 奖项容器
      turnNum = 1 / num, // 文字旋转 turn 值
      html = []; // 奖项

    ele = $(id);
    canvas = ele.querySelector('.gb-turntable-canvas');
    container = ele.querySelector('.gb-turntable-container');
    btn = ele.querySelector('.gb-turntable-btn');

    if (!canvas.getContext) {
      showMsg('¡Lo siento! Navegador no soportado'); // ¡Lo siento! Navegador no soporta
      return;
    }
    // 获取绘图上下文 Obtener dibujo contexto
    ctx = canvas.getContext('2d');
    //radio de la torta
    radio = 200; 

    for (var i = 0; i < num; i++) {
      // 保存当前状态 Guardar el estado actual
      ctx.save();
      // 开始一条新路径 Iniciar un nuevo camino
      ctx.beginPath();
      // 位移到圆心，下面需要围绕圆心旋转 Giro al centro, la siguiente necesidad de rotar alrededor del centro
      ctx.translate(radio, radio);
      // 从(0, 0)坐标开始定义一条新的子路径 A partir de (0, 0) de coordenadas define un nuevo sub-path
      ctx.moveTo(0, 0);
      // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。 
      // Arco de rotación, el ángulo debe ser convertido a radianes, utilizando grados * math.pi / 180 fórmula
      ctx.rotate((360 / num * i - rotateDeg) * Math.PI / 180);
      // 绘制圆弧 Dibujar un arco
      ctx.arc(0, 0, radio, 0, 2 * Math.PI / num, false);

      // 颜色间隔 espaciado de color
      if (i % 2 == 0) {
        ctx.fillStyle = '#ffb820';
      } else {
        ctx.fillStyle = '#ffcb3f';
      }

      // 填充扇形 Lleno de ventilador
      ctx.fill();
      // 绘制边框 Dibujar un borde
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#e4370e';
      ctx.stroke();

      // 恢复前一个状态 Restaurar el estado anterior
      ctx.restore();

      // 奖项列表 Lista de premios
      var prizeList = opts.prizes;
      html.push('<li class="gb-turntable-item"> <span style="');
      html.push(transform + ': rotate(' + i * turnNum + 'turn)">');
      !!prizeList[i].img ? html.push('<img src="' + prizeList[i].img + '" />') : html.push(prizeList[i].text)
      html.push('</span> </li>');
      if ((i + 1) === num) {
        prizeItems.className = 'gb-turntalbe-list';
        container.appendChild(prizeItems);
        prizeItems.innerHTML = html.join('');
      }

    }

  }

  /**
   * [提示] rápido
   * @param  {String} msg [description]
   */
  function showMsg(msg) {
    alert(msg);
  }

  /**
   * [初始化转盘]
   * @return {[type]} [description]
   */
  /*  function runInit() {
      removeClass(container, 'gb-run');
      container.style[transform] = 'rotate(0deg)';
      container.style[transform] = '';
    }*/

  /**
   * 旋转转盘
   * @param  {[type]} deg [description]
   * @return {[type]}     [description]
   */
  function runRotate(deg) {
    // runInit();

    document.getElementById('contador').innerText=deg;
    // setTimeout(function() {
    // addClass(container, 'gb-run');
    container.style[transform] = 'rotate(' + deg + 'deg)';
    // }, 10);
  }

  var tiempo = 1
  var anterior = 0
  var inicial = 10
  var cont = inicial
  var cantidadSon = 110

  function sonido() {
      var ease = bezier(.94,.13,.94,.56)
      reproAudio('asset/waka.wav')

      anterior = tiempo
      tiempo =  6000 * ease(cont/(cantidadSon + inicial));
      let total = tiempo - anterior
      cont++
      document.getElementById('contador').innerText = cont;
      if(cont < (cantidadSon + inicial)){
        // sonido(tiempo, cont+1)
        let interval = setTimeout(sonido, total )
      }
  }
  /**
   * 抽奖事件
   * @return {[type]} [description]
   */
  function events() {
    bind(btn, 'click', function () {

      cont = inicial
      sonido() 
      /*      var prizeId,
                chances;*/

      addClass(btn, 'disabled');

      fnGetPrize(function (data) {
        optsPrize = {
          prizeId: data[0],
          chances: data[1]
        }
        // 计算旋转角度 El cálculo de un ángulo de rotación
        deg = deg || 0;
        deg = deg + (360 - deg % 360) + (360 * 10 - data[0] * (360 / num))
        console.log("angulo rotacion: "+deg)
        runRotate(deg);
      });

      // 中奖提示 Tip ganar
      bind(container, transitionEnd, eGot);
    });
  }

  async function eGot() {
    if (optsPrize.chances) removeClass(btn, 'disabled');

    await reproAudio('asset/crrect_answer3.mp3',()=>{
      fnGotBack(prizes[optsPrize.prizeId].text);
    });
  }

  function reproAudio(urlaudio, callback = null) {
      var sound = new Howl({
        src: [urlaudio],
        volume: 0.5,
        onend: callback
      });
      sound.play()
  }

  /**
   * Bind events to elements
   * @param {Object}    ele    HTML Object
   * @param {Event}     event  Event to detach
   * @param {Function}  fn     Callback function
   */
  function bind(ele, event, fn) {
    if (typeof addEventListener === 'function') {
      ele.addEventListener(event, fn, false);
    } else if (ele.attachEvent) {
      ele.attachEvent('on' + event, fn);
    }
  }

  /**
   * Unbind events to elements
   * @param {Object}    ele    HTML Object
   * @param {Event}     event  Event to detach
   * @param {Function}  fn     Callback function
   */
  /*  function unbind(ele, event, fn) {
        if (typeof removeEventListener === 'function') {
            ele.removeEventListener(event, fn, false);
        } else if (ele.detachEvent) {
            ele.detach('on' + event, fn);
        }
    }*/

  /**
   * hasClass
   * @param {Object} ele   HTML Object
   * @param {String} cls   className
   * @return {Boolean}
   */
  function hasClass(ele, cls) {
    if (!ele || !cls) return false;
    if (ele.classList) {
      return ele.classList.contains(cls);
    } else {
      return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }
  }

  // addClass
  function addClass(ele, cls) {
    if (ele.classList) {
      ele.classList.add(cls);
    } else {
      if (!hasClass(ele, cls)) ele.className += '' + cls;
    }
  }

  // removeClass
  function removeClass(ele, cls) {
    if (ele.classList) {
      ele.classList.remove(cls);
    } else {
      ele.className = ele.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  var gbTurntable = {
    init: function (opts) {
      return init(opts);
    }
  }

  // (@see https://github.com/madrobby/zepto/blob/master/src/zepto.js)
  window.gbTurntable === undefined && (window.gbTurntable = gbTurntable);

  // AMD (@see https://github.com/jashkenas/underscore/blob/master/underscore.js)
  if (typeof define == 'function' && define.amd) {
    define('GB-canvas-turntable', [], function () {
      return gbTurntable;
    });
  }

}());
