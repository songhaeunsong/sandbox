import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import useDomainStore from '@/store';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const ServerInputModal = () => {
  const queryClient = useQueryClient();

  const [localURL, setLocalURL] = useState('');
  const [deployedURL, setDeployedURL] = useState('');
  const [isOpenedModal, setIsOpenedModal] = useState(false);

  const { setDomain } = useDomainStore();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setState(e.target.value);
  };

  const activeEnterLocalURL = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onsubmitLocalURL();
  };

  const activeEnterDeployedURL = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onsubmitDeployedURL();
  };

  const onsubmitLocalURL = () => {
    setDomain(`http://${localURL}`);
    queryClient.invalidateQueries({ queryKey: ['todos'] });
    setIsOpenedModal(false);
    setLocalURL('');
    setDeployedURL('');
  };

  const onsubmitDeployedURL = () => {
    setDomain(`https://${deployedURL}`);
    queryClient.invalidateQueries({ queryKey: ['todos'] });
    setIsOpenedModal(false);
    setLocalURL('');
    setDeployedURL('');
  };

  // TODO
  // 서버 url에 대한 정보가 있으면 모달을 안 열고
  // 정보가 없으면 모달 열기

  // 탭이 바뀔 때는 입력값이 초기화 되는 게 좋지 않을까?
  // 현재 local에다가 아무값이나 입력해놓고 deploy에 내가 원하는값을 입력했을 때, local값이 출력된다. -> 당연한 결과인 것 같음
  // 해결방법이 두가지 인데, 모달이 열린상태 , Tab 두가지 상태 모두 라우팅으로 처리하는 방법이 있음 : 어느 페이지가 그렇게 되어있었는데 기억이..
  // Submit을 분리

  return (
    <Dialog open={isOpenedModal} onOpenChange={setIsOpenedModal}>
      <DialogTrigger
        onClick={() => setIsOpenedModal(true)}
        className='h-10 rounded-[5px] border px-4 py-2 text-sm font-medium'
      >
        Edit Base URL
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Base URL</DialogTitle>
          <DialogDescription className='text-[12px]'>
            개발한 서버의 Base URL을 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue='local'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='local'>Local</TabsTrigger>
            <TabsTrigger value='deployed'>Deployed</TabsTrigger>
          </TabsList>
          <TabsContent value='local'>
            <div className='flex gap-2'>
              <input
                className='w-[80px] rounded-[5px] border p-3 text-center focus:outline-none'
                value={'http://'}
                disabled
              />
              <input
                className='w-full rounded-[5px] border p-3 placeholder-gray-200 focus:outline-none'
                value={localURL}
                onChange={e => handleInputChange(e, setLocalURL)}
                onKeyDown={e => activeEnterLocalURL(e)}
                placeholder='localhost:8080'
              />
              <button
                className='w-16 rounded-[5px] border text-[12px]'
                onClick={onsubmitLocalURL}
              >
                Go!
              </button>
            </div>
          </TabsContent>
          <TabsContent value='deployed'>
            <div className='flex gap-2'>
              <input
                className='w-[80px] rounded-[5px] border p-3 text-center focus:outline-none'
                value={'https://'}
                disabled
              />
              <input
                className='w-full rounded-[5px] border p-3 outline-none focus:outline-none'
                value={deployedURL}
                onChange={e => handleInputChange(e, setDeployedURL)}
                onKeyDown={e => activeEnterDeployedURL(e)}
                placeholder='abcde.com'
              />
              <button
                className='w-16 rounded-[5px] border text-[12px] outline-none'
                onClick={onsubmitDeployedURL}
              >
                Go!
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ServerInputModal;
