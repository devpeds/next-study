# Experiment 2: Long Post List

RSC과 React Query를 사용해 10,000개의 목록을 보여주는 페이지를 구현하고, 각 전략이 성능에 미치는 영향을 비교하는 실험이다.

## Implementation

### RSC

Streaming SSR 적용 여부를 비교하기 위해 `/server` 페이지와 `/server-suspense` 페이지를 구성했다. 두 페이지 모두 서버에서 10,000개 목록을 불러와 UI를 그리고, `/server-suspense` 페이지는 목록을 불러 리스트를 그리는 부분을 `<Suspense>`로 감싸 Streaming SSR이 적용되도록 하였다.

추가적으로 `/server-suspense` 페이지와 동일한 코드에 엣지 런타임에서 실행하는 `/server-edge` 페이지를 추가해, 런타임 환경에 따른 성능 차이를 측정했다.

### React Query

서버 사이드에서 prefetch 적용 여부를 비교하기 위해 `/react-query` 페이지와 `/react-query-hydration` 페이지를 구성했다. `/react-query` 페이지는 클라이언트에서 목록을 가져와 UI를 그린다. 반면 `/react-query-hydration` 페이지는 조금 복잡하다. 우선 서버 사이드에서 목록을 미리 가져와 `<HydrationBoundary>`에 데이터를 넘겨주고, 서버에서 목록을 그려 클라이언트에 넘겨준다. 목록에 해당하는 부분은 클라이언트 컴포넌트로, 클라이언트는 서버에서 목록 UI를 받으면 리액트와 연동하기 위해 Hydration 과정이 필요하다. 이때 클라이언트 사이드의 `QueryClient`의 `staleTime`을 1분으로 설정해, 클라이언트에서 하이드레이션이 이후 동일 데이터를 다시 가져오지 않도록 한다.

## Analysis (on localhost on production mode)

### 첫 페이지 로드 (URL Navigation)

|            Requests             |  `/server`  | `/server-ssr` | `/server-edge` | `/react-query` | `/react-query-hydration` |
| :-----------------------------: | :---------: | :-----------: | :------------: | :------------: | :----------------------: |
|     Document - Transferred      |    151KB    |     151KB     |     13.6MB     |     7.3KB      |          134KB           |
|       Document - Resource       |   13.6MB    |    13.6MB     |     13.6MB     |     56.5KB     |          11.0MB          |
|         Document - Time         |    528ms    |     747ms     |     920ms      |      7ms       |          330ms           |
|   JS files<br/>(Total/Unique)   | 134KB/2.3KB |  134KB/2.3KB  |  134KB/2.3KB   |  139KB/7.3KB   |       145KB/12.6KB       |
| API call<br/>(Transferred/Time) |    --/--    |     --/--     |     --/--      |  4.81MB/23ms   |          --/--           |

위의 테이블은 주소창에 URL을 입력해 페이지에 접속할 때 발생하는 응답 정보를 정리한 것이다. RSC로만 구성된 세 페이지(`/server`, `/server-ssr`, `/server-edge`)의 경우, 동일한 JS 파일을 사용한다. 반면 문서의 경우, 각 페이지마다 응답 크기(`Document - Transferred`)와 시간이 서로 다르지만 압축을 해제한 실제 응답 크기(`Document - Resource`)는 모두 동일하다. React Query를 사용하는 두 페이지의 경우, 서버에서 UI를 그려 내려주는 `/react-query-hydration` 페이지가 `/react-query` 페이지보다 응답 크기 및 시간이 훨씬 큰 것을 알 수 있다.

`/server-edge` 페이지는 `/server`, `/server-ssr` 페이지와 달리 실제 리소스와 동일한 크기로 응답이 내려온다. 이는 Node.js 런타임에서 동작하는 두 페이지와 달리, 응답에 대한 압축을 런타임이 아닌 에지 서버에서 담당한다. 로컬 환경에서 edge 런타임을 실행할 경우 압축을 담당하는 부분이 빠지게 되므로 압축 없이 응답이 내려온다.

|       Timing       | `/server` | `/server-ssr` | `/server-edge` | `/react-query` | `/react-query-hydration` |
| :----------------: | :-------: | :-----------: | :------------: | :------------: | :----------------------: |
| Queue ~ Connection |  ~2.5ms   |    ~2.5ms     |     ~2.5ms     |     ~2.5ms     |          ~2.5ms          |
|      Waiting       |   380ms   |     20ms      |      20ms      |     3.40ms     |          210ms           |
|  Content Download  |   145ms   |     724ms     |     900ms      |     1.20ms     |          120ms           |

응답 속도의 경우, `/react-query` 페이지를 제외하고 모두 300ms 이상 소요된다. 하지만 각 응답 속도의 상세 정보를 살펴보면, `/server-ssr`과 `/server-edge` 페이지는 컨텐츠 다운로드 시간(`Content Download`)은 길지만 응답 대기 시간(`Waiting`)은 매우 짧다. 문서의 응답 대기 시간은 **TTFB(Time To First Byte)** 직결되기 때문에, 응답 대기 시간이 짧은 두 페이지가 `/server` 페이지보다 전체 로딩 속도는 느리지만 사용자는 훨씬 빠르게 로드되는 것처럼 체감할 수 있다.

또한 `/react-query-hydration` 페이지는 `/server` 페이지보다 문서 크기, 응답 속도 및 TTFB 모두 더 나은 수치를 보인다. 이는 서버 사이드 렌더링 관점에서 서버 컴포넌트보다 클라이언트 컴포넌트가 성능이 좀 더 좋다는 것을 알 수 있다.

### Link Navigation from `/experiment-2`

|         Requests          | `/server` | `/server-ssr` | `/server-edge` | `/react-query` | `/react-query-hydration` |
| :-----------------------: | :-------: | :-----------: | :------------: | :------------: | :----------------------: |
| RSC Payload - Transferred |  84.5KB   |    84.6KB     |     7.35MB     |     4.8KB      |          68.5KB          |
|  RSC Payload - Resource   |  7.35MB   |    7.35MB     |     7.35MB     |     25.8KB     |          4.19MB          |
|    RSC Payload - Time     |   197ms   |     200ms     |     340ms      |      7ms       |           80ms           |
|   JS files - Preloaded    |    --     |      --       |       --       |     7.3KB      |          3.9KB           |
|     JS files - Loaded     |    --     |      --       |       --       |       --       |          8.7KB           |

위의 테이블은 `/experiment-2` 페이지에서 링크를 눌러 페이지 이동할 때 발생하는 응답 정보를 정리한 것이다. `/server` 페이지, `/server-ssr` 페이지의 경우 URL 네비게이션 케이스와 달리 RSC 페이로드의 응답 속도가 거의 비슷하며, 따로 정리하지 않았지만 상세 항목을 확인해보면 응답 대기 시간 역시 두 페이지가 거의 동일했다. React Query 관련 페이지의 RSC 페이로드는 URL 네비게이션 시 문서 응답과 유사한 패턴을 보인다. 한편, `react-query-hydration` 페이지는 `react-query` 페이지와 달리 페이지 이동했을 때 추가 JS 파일을 요청하는 것을 확인할 수 있다.

|                    Pages |       Navigation Time       |
| -----------------------: | :-------------------------: |
|                `/server` |            870ms            |
|            `/server-ssr` |            100ms            |
|           `/server-edge` |            30ms             |
|           `/react-query` | 21ms(first)/630ms(re-visit) |
| `/react-query-hydration` |            750ms            |

응답 정보만 가지고는 페이지 이동 속도를 제대로 측정할 수 없어, `<NavigationTimer />`를 만들어 링크를 클릭했을 때부터 페이지 렌더링까지 쇼오되는 시간(`Navigation Time`)을 측정했다. 특이 사항으로는 처음 `/react-query` 페이지로 이동할 때와 재방문 시 걸리는 시간이 다르다는 점이다. 이는 첫 방문 이후 React Query가 목록 데이터를 캐시하고, 재방문 시 캐시 데이터를 활용해 목록을 생성하기 때문이다. 이 과정에서 DOM 요소 수가 첫 방문보다 크게 증가해 렌더링에 더 많은 시간이 소요되는 것으로 보인다.

`/react-query` 페이지를 제외한 다른 페이지와 비교했을 때, 페이지 이동 후에 목록을 그리는 `/server-ssr`페이지와 `/server-edge` 페이지가 다른 두 페이지보다 훨씬 빠르게 동작하는 것을 확인할 수 있다. `/server` 페이지와 `/react-query-hydration` 페이지의 이동 시간이 100ms 이상 차이나는데, RSC 페이로드 응답 시간과 비슷하게 차이나는 것으로 보아, 두 페이지간 속도 차이는 RSC 페이로드의 응답 속도 차이에 의한 것으로 볼 수 있다.

### Lighthouse

|   Metrics   | `/server` | `/server-ssr` | `/server-edge` | `/react-query` | `/react-query-hydration` |
| :---------: | :-------: | :-----------: | :------------: | :------------: | :----------------------: |
|     FCP     |   0.6s    |     0.4s      |     11.2s      |      0.3s      |           0.6s           |
|     LCP     |   3.3s    |     4.0s      |     14.8s      |      7.2s      |           3.8s           |
|     TBT     |   240ms   |     280ms     |     310ms      |     130ms      |           70ms           |
| Speed Index |   1.0s    |     2.6s      |     11.2s      |      0.5s      |           0.8s           |
|    Score    |    73     |      62       |       42       |       74       |            79            |

Lighthouse 성능 측정 항목에 대한 자세한 내용은 [여기서](./lighthouse/) 확인할 수 있다.
