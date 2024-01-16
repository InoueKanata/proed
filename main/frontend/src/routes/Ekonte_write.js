import React, { useRef, useEffect, useState } from 'react';
import { Button,ThemeProvider,TextField,Box,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Container,Input } from '@mui/material';
import theme from '../theme';
import axios from 'axios';
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
  const [selectedFile, setSelectedFile] = useState(null);
  const handleSceneNumberChange = (event) => {
    const sanitizedValue = event.target.value.replace(/[^0-9]/g, '');
    setNumber(sanitizedValue);
  };
  var param = window.location.search;
  const [triggerEffect, setTriggerEffect] = useState(false);
  const decodedParam = decodeURIComponent(param);
  const [scenetxt, setScenetxt] = useState("");
  const [cuttxt, setCuttxt] = useState("");
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
  const handleSaveToFolder = async (row) => {
  const dataURL = getCanvasDataURL();
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  const file = new File([blob], 'saved_image.png', { type: 'image/png' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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
      setTriggerEffect(true);
    }
  } catch (error) {
    console.error(error);
  }
  setTriggerEffect(true);
};

const handleDeleteRow = async (row) => {
  try {
    const requestData = {
      scene: row[0],
      cut: row[1],
    };
    // リクエストを送信
    const response = await fetch(`http://localhost:5000/deleteRowFromCSV/${csvname}`, {
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
      setTriggerEffect(true);
    }
  } catch (error) {
    console.error(error);
  }
  setTriggerEffect(true);
};
const handleFileSelect = (cut,scene) => (event) => {
  // リクエストは、/main/frontend/public/images/の後に続くpassで行う。例）test1/image1_1
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    setSelectedFile(file);
    console.log(scene);
    console.log(cut);
    const formData = new FormData();
    formData.append('file', file);
    const URLs = 'http://localhost:5000/upload/'+csvname+'/image'+cut+'_'+scene;
    axios.post(URLs, formData)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('ファイルのアップロードエラー:', error);
    });
  } else {
    alert('画像ファイルを選択してください。');
  }
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
        <Container Container maxWidth="xl" component={Paper} sx={{marginTop:5}}>プロジェクト名：「{csvname}」<br/>同じシーン、カット数が存在する場合は上書きされます。反映されない場合はリロードしてください。<br/>
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
          <TextField id="scene" label="シーン" style={{ marginLeft:'60px'}}sx={{ width: '10ch' }} type="number" onChange={(event) => {handleSceneNumberChange(event); setScenetxt(event.target.value);}} size="small"/>
          <TextField id="cut" label="カット" sx={{ width: '10ch' }} type="number" onChange={(event) => {handleSceneNumberChange(event); setCuttxt(event.target.value);}} size="small"/>
          <TextField id="people" label="人数" sx={{ width: '10ch' }} type="number" onChange={handleSceneNumberChange} size="small"/>
          <TextField id="place" label="場所" placeholder="どこで" sx={{ width: '25ch' }} multiline size="small"/>
          <TextField id="overview" label="概要" placeholder="何人の誰が、何をして、どこを向いているか" sx={{ width: '50ch' }} multiline size="small"/>
          <TextField id="lines" label="セリフ"  sx={{ width: '25ch' }} multiline size="small"/>
          <TextField id="seconds" label="秒"  sx={{ width: '10ch' }} size="small"/>
        <br/>
        <Button disabled={!scenetxt || !cuttxt} variant="outlined" style={{margin:'10px'}}onClick={handleAddDataToCSV}>追加・上書き</Button>
        <Button variant="outlined" style={{margin:'2px'}} onClick={() => handlePopupOpen()}>ペイントを開く</Button>
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
                  <TableCell align="center" style={{borderTop: '2px solid #c0c0c0',borderRight: '2px solid #c0c0c0'}}>AI生成</TableCell>
                  <TableCell align="center" style={{borderTop: '2px solid #c0c0c0',borderRight: '2px solid #c0c0c0'}}>画像挿入</TableCell>
                  <TableCell align="center" style={{borderTop: '2px solid #c0c0c0',borderRight: '2px solid #c0c0c0'}}>削除</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {csvContent.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="right" style={{borderRight: '2px solid #c0c0c0',borderLeft: '2px solid #c0c0c0'}}>{row[0]}</TableCell>
                    <TableCell align="right" style={{borderRight: '2px solid #c0c0c0'}}>{row[1]}</TableCell>
                    <TableCell align="center" style={{borderRight: '2px solid #c0c0c0'}}>
                    <img src={"/images/"+csvname+"/image" + row[0] +"_"+ row[1]+".png"} alt="Test Image" style={{ width: '320px', height: '160px' }} />
                    </TableCell>
                    <TableCell align="right" style={{borderRight: '2px solid #c0c0c0'}}>{row[2]}</TableCell>
                    <TableCell align="right" style={{borderRight: '2px solid #c0c0c0'}}>{row[3]}</TableCell>
                    <TableCell align="right" style={{borderRight: '2px solid #c0c0c0'}}>{row[4]}</TableCell>
                    <TableCell align="right" style={{borderRight: '2px solid #c0c0c0'}}>{row[5]}</TableCell>
                    <TableCell align="right" style={{borderRight: '2px solid #c0c0c0'}}>{row[6]}</TableCell>
                    <TableCell align="center" style={{borderRight: '2px solid #c0c0c0'}}><Button variant="outlined">生成</Button></TableCell>
                    <TableCell align="center" style={{borderRight: '2px solid #c0c0c0'}}>
                    <label htmlFor="fileInput">
                    <Input
                      type="file"
                      id="fileInput"
                      inputProps={{ accept: 'image/*' }}
                      onChange={(e) => handleFileSelect(row[0], row[1], e)}
                      style={{ display: 'none' }}
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      style={{ margin: '2px' }}
                    >
                      ファイルを選択
                    </Button>
                    </label>
                    </TableCell>
                    <TableCell align="center" style={{borderRight: '2px solid #c0c0c0'}}><Button variant="outlined" onClick={() => handleDeleteRow(row)}>削除</Button></TableCell>
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
