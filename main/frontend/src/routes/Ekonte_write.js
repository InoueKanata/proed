import React, { useRef, useEffect, useState } from 'react';
import { Button,ThemeProvider,TextField,Box,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Container } from '@mui/material';
import theme from '../theme';
//import { useHistory } from 'react-router-dom';
//↑最期まで使用しなかった場合削除。アンドゥの機能用
//import myImage from './/image.png'
//↑画像読み込みに使用
const Ekonte_write = () => {
  let csvname;
  const popupRef = useRef(null);
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [scale, setScale] = useState(1);
  const [drawing, setDrawing] = useState(false);
  const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });
  const [lineColor, setLineColor] = useState('black');
  const [lineColors, setLineColors] = useState([]);
  const [lineWidth, setLineWidth] = useState(2);
  const [csvContent, setCsvContent] = useState([]);
  const [number, setNumber] = useState('');
  const handleSceneNumberChange = (event) => {
    const sanitizedValue = event.target.value.replace(/[^0-9]/g, '');
    setNumber(sanitizedValue);
  };
  var param = window.location.search;
  const [triggerEffect, setTriggerEffect] = useState(false);
  
  const decodedParam = decodeURIComponent(param);
  csvname = decodedParam;
  if(csvname.includes('.csv'))
    csvname = String(csvname.slice(1,-4));
    
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
    // 初期化
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = lineWidth;
    

    const fetchCSVContent = async (csvname) => {
      try {
        const response = await fetch(`http://localhost:5000/fetchCSVContent/${csvname}`);
        const data = await response.json();
        if (data.content) {
          console.log(data.content)
          setCsvContent(data.content);
          data.content = [...data.content].sort((a, b) => {
            const sceneA = parseInt(a[0], 10);
            const cutA = parseInt(a[1], 10);
            const sceneB = parseInt(b[0], 10);
            const cutB = parseInt(b[1], 10);
            
            if (sceneA !== sceneB) {
              return sceneA - sceneB;
            }
          
            return cutA - cutB;
          });
          setCsvContent(data.content);
          csvname=encodeURIComponent(csvname)
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCSVContent(csvname);
  }, [csvname, triggerEffect]);

  const getCanvasDataURL = () => {
    const canvas = canvasRef.current;
    return canvas.toDataURL(); // canvasの内容をDataURLとして取得
  };

  const handleSaveToFolder = async () => {
  const dataURL = getCanvasDataURL();

  // サーバーサイドに画像を保存するためのエンドポイントURL
  const saveImageEndpoint = 'http://localhost:5000/saveImage';

  try {
    // サーバーサイドに画像を保存するリクエストを送信
    const response = await fetch(saveImageEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dataURL }),
    });

    const result = await response.json();
    if (result.success) {
      alert('画像をフォルダに保存しました！');
    } else {
      console.error(result.error);
    }
  } catch (error) {
    console.error(error);
  }
};


  const handleCanvasMouseDown = (e) => {
    setDrawing(true);
    setPrevPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const handleCanvasMouseMove = (e) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const ctx = context;

    const currentPosition = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };

    ctx.lineJoin = 'round'; // 線の接続部分を丸くする
    ctx.lineCap = 'round'; // 線の先端を丸くする
    ctx.strokeStyle = lineColor; // 現在の線の色を設定
    ctx.lineWidth = lineWidth; // 線の太さを設定

    ctx.beginPath();
    ctx.moveTo(prevPosition.x, prevPosition.y);
    ctx.lineTo(currentPosition.x, currentPosition.y);
    ctx.strokeStyle = lineColor; // 現在の線の色を設定
    ctx.stroke();
    ctx.closePath();

    setPrevPosition(currentPosition);
  };

  const handleCanvasMouseUp = () => {
    setDrawing(false);
    setLineColors([...lineColors, lineColor]); // 描画が終わったら線の色を保存
  };

  const handleReset = () => {
    const canvas = canvasRef.current;
    const ctx = context;

    // 描画をリセット
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setLineColors([]);
  };

  /*const handleSaveToFolder = () => {
    // フォルダに保存する処理を実装（ここでは具体的な実装は省略）
    alert('画像をフォルダに保存しました！');
  };*/

  const handlePopupOpen = () => {
    const popup = popupRef.current;
    popup.style.display = 'block';
  };

  const handlePopupClose = () => {
    const popup = popupRef.current;
    popup.style.display = 'none';
  };

  const handleColorChange = (newColor) => {
    setLineColor(newColor);
  };

  const handleLineWidthChange = (newWidth) => {
    setLineWidth(newWidth);
    if (context) {
      context.lineWidth = newWidth;
    }
  }
  const handleAddDataToCSV = async () => {
    console.log(csvname)
    try {
      // 入力されたデータを取得
      const scene = document.getElementById('scene').value;
      const cut = document.getElementById('cut').value;
      const people = document.getElementById('people').value;
      const place = document.getElementById('place').value;
      const overview = document.getElementById('overview').value;
      const lines = document.getElementById('lines').value;
      const seconds = document.getElementById('seconds').value;

      // リクエストのデータを作成
      const requestData = {
        scene: scene,
        cut: cut,
        people: people,
        place: place,
        overview: overview,
        lines: lines,
        seconds: seconds
      };

      // リクエストを送信
      const response = await fetch(`http://localhost:5000/writeDataToCSV/${csvname}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (data.error) {
        console.error(data.error);
      } else {
        // 成功メッセージなどを処理（必要に応じて）
      }
    } catch (error) {
      console.error(error);
    }
    setTriggerEffect(true);
  };

  return (
    <div>
      <h2>絵・Vコンテ作成</h2>
      <ThemeProvider theme={ theme }>
        <Box
        component="form"
        sx={{marginLeft:60,
          '& .MuiTextField-root': { m: 3},
          color: 'black',
        }}
        noValidate
        autoComplete="off"
        >
        <Container Container maxWidth="xl" component={Paper} sx={{marginTop:5}}>
        <Button variant="outlined" style={{marginRight:'10px'}}>画像データを選択</Button>
        <Button variant="outlined" onClick={() => handlePopupOpen()}>ペイントアプリを開く</Button>
        <br/>
        <div
          ref={popupRef}
          style={{
            display: 'none',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '1px solid black',
            zIndex: 999,
            backgroundColor: 'white',
          }}
        >
          <Button variant="outlined" onClick={() => handlePopupClose()}>閉じる</Button>
          <Button variant="outlined" onClick={handleReset}>リセット</Button>
          <Button variant="outlined" onClick={handleSaveToFolder}>保存</Button>
          <div>
            <span>線の色：</span>
            <Button variant="outlined" onClick={() => handleColorChange('black')} style={{ backgroundColor: 'black', marginRight: '5px' }}>
            <span style={{ color: 'black' }}></span>
            </Button>

            <Button variant="outlined" onClick={() => handleColorChange('white')} style={{ backgroundColor: 'white', marginRight: '5px' }}>
            <span style={{ color: 'white' }}></span>
            </Button>

            <Button variant="outlined" onClick={() => handleColorChange('red')} style={{ backgroundColor: 'red', marginRight: '5px' }}>
            <span style={{ color: 'red' }}></span>
            </Button>

            <Button variant="outlined" onClick={() => handleColorChange('blue')} style={{ backgroundColor: 'blue', marginRight: '5px' }}>
            <span style={{ color: 'blue' }}></span>
            </Button>

            <Button variant="outlined" onClick={() => handleColorChange('green')} style={{ backgroundColor: 'green', marginRight: '5px' }}>
            <span style={{ color: 'green' }}></span>
            </Button>

            <Button variant="outlined" onClick={() => handleColorChange('yellow')} style={{ backgroundColor: 'yellow', marginRight: '5px' }}>
            <span style={{ color: 'yellow' }}></span>
            </Button>

            <Button variant="outlined" onClick={() => handleColorChange('orange')} style={{ backgroundColor: 'orange', marginRight: '5px' }}>
            <span style={{ color: 'orange' }}></span>
            </Button>

            <Button variant="outlined" onClick={() => handleColorChange('purple')} style={{ backgroundColor: 'purple', marginRight: '5px' }}>
            <span style={{ color: 'purple'}}></span>
            </Button>

            <Button variant="outlined" onClick={() => handleColorChange('pink')} style={{ backgroundColor: 'pink', marginRight: '5px' }}>
            <span style={{ color: 'pink' }}></span>
            </Button>

            <Button variant="outlined" onClick={() => handleColorChange('brown')} style={{ backgroundColor: 'brown', marginRight: '5px' }}>
            <span style={{ color: 'brown'}}></span>
            </Button>

            <Button variant="outlined" onClick={() => handleColorChange('gray')} style={{ backgroundColor: 'gray', marginRight: '5px' }}>
            <span style={{ color: 'gray' }}></span>
            </Button>

            <Button variant="outlined" onClick={() => handleColorChange('cyan')} style={{ backgroundColor: 'cyan', marginRight: '5px' }}>
            <span style={{ color: 'cyan' }}></span>
            </Button>

            {/* 追加: 他の色ボタンを追加 */}
          </div>
          <div>
          <span>線の太さ：</span>
          <Button variant="outlined" onClick={() => handleLineWidthChange(2)}>2px</Button>
          <Button variant="outlined" onClick={() => handleLineWidthChange(4)}>4px</Button>
          <Button variant="outlined" onClick={() => handleLineWidthChange(6)}>6px</Button>
          <Button variant="outlined" onClick={() => handleLineWidthChange(8)}>8px</Button>
          <Button variant="outlined" onClick={() => handleLineWidthChange(10)}>10px</Button>
          {/* 他の太さボタンを追加 */}
          </div>
          <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              width={640 * scale}  // 描画領域の幅
              height={320 * scale} // 描画領域の高さ
              style={{ border: '1px solid black' }}
            />
          </div>
        </div>
          <TextField id="scene" label="シーン" style={{ marginLeft:'60px'}}sx={{ width: '10ch' }} type="number" onChange={handleSceneNumberChange} size="small"/>
          <TextField id="cut" label="カット" sx={{ width: '10ch' }} type="number" onChange={handleSceneNumberChange} size="small"/>
          <TextField id="people" label="人数" sx={{ width: '10ch' }} type="number" onChange={handleSceneNumberChange} size="small"/>
          <TextField id="place" label="場所" placeholder="どこで" sx={{ width: '25ch' }} multiline size="small"/>
          <TextField id="overview" label="概要" placeholder="何人の誰が、何をして、どこを向いているか" sx={{ width: '50ch' }} multiline size="small"/>
          <TextField id="lines" label="セリフ"  sx={{ width: '25ch' }} multiline size="small"/>
          <TextField id="seconds" label="秒"  sx={{ width: '10ch' }} size="small"/>
        <br/>
        <Button variant="outlined" style={{margin:'10px'}}onClick={handleAddDataToCSV}>追加</Button>
        </Container>
        <Container Container maxWidth="xl" component={Paper} sx={{marginTop:5}}>
          <TableContainer component={Paper} style={{ marginLeft: '0px', marginRight: '260px',width: '100%', overflowX: 'auto'}}>
            <Table  style={{ maxWidth: 1560}} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{borderTop: '2px solid #c0c0c0',borderRight: '2px solid #c0c0c0',borderLeft: '2px solid #c0c0c0'}}>シーン</TableCell>
                  <TableCell align="center" style={{borderTop: '2px solid #c0c0c0',borderRight: '2px solid #c0c0c0'}}>カット</TableCell>
                  <TableCell align="center" style={{borderTop: '2px solid #c0c0c0',borderRight: '2px solid #c0c0c0'}}>絵</TableCell>
                  <TableCell align="center" style={{borderTop: '2px solid #c0c0c0',borderRight: '2px solid #c0c0c0'}}>人数</TableCell>
                  <TableCell align="center" style={{borderTop: '2px solid #c0c0c0',borderRight: '2px solid #c0c0c0'}}>場所</TableCell>
                  <TableCell align="center" style={{borderTop: '2px solid #c0c0c0',borderRight: '2px solid #c0c0c0'}}>概要</TableCell>
                  <TableCell align="center" style={{borderTop: '2px solid #c0c0c0',borderRight: '2px solid #c0c0c0'}}>セリフ</TableCell>
                  <TableCell align="center" style={{borderTop: '2px solid #c0c0c0',borderRight: '2px solid #c0c0c0'}}>秒</TableCell>
                  <TableCell align="center" style={{borderTop: '2px solid #c0c0c0',borderRight: '2px solid #c0c0c0'}}>生成</TableCell>
                  <TableCell align="center" style={{borderTop: '2px solid #c0c0c0',borderRight: '2px solid #c0c0c0'}}>編集</TableCell>
                  <TableCell align="center" style={{borderTop: '2px solid #c0c0c0',borderRight: '2px solid #c0c0c0'}}>削除</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {csvContent.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="right" style={{borderRight: '2px solid #c0c0c0',borderLeft: '2px solid #c0c0c0'}}>{row[0]}</TableCell>
                    <TableCell align="right" style={{borderRight: '2px solid #c0c0c0'}}>{row[1]}</TableCell>
                    <TableCell align="center" style={{borderRight: '2px solid #c0c0c0'}}>
                    <img src="image0.png" alt="Test Image" style={{ width: '50px', height: '50px' }} />
                    </TableCell>
                    <TableCell align="right" style={{borderRight: '2px solid #c0c0c0'}}>{row[2]}</TableCell>
                    <TableCell align="right" style={{borderRight: '2px solid #c0c0c0'}}>{row[3]}</TableCell>
                    <TableCell align="right" style={{borderRight: '2px solid #c0c0c0'}}>{row[4]}</TableCell>
                    <TableCell align="right" style={{borderRight: '2px solid #c0c0c0'}}>{row[5]}</TableCell>
                    <TableCell align="right" style={{borderRight: '2px solid #c0c0c0'}}>{row[6]}</TableCell>
                    <TableCell align="center" style={{borderRight: '2px solid #c0c0c0'}}><Button variant="outlined">生成</Button></TableCell>
                    <TableCell align="center" style={{borderRight: '2px solid #c0c0c0'}}><Button variant="outlined">編集</Button></TableCell>
                    <TableCell align="center" style={{borderRight: '2px solid #c0c0c0'}}><Button variant="outlined">削除</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </Container>
        </Box>
      </ThemeProvider>
    </div>
  );
};

export default Ekonte_write;
